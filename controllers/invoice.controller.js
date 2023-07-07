const Invoice = require("../models/invoice.model");
const { validationResult } = require("express-validator");
const xml2js = require("xml2js");
const fs = require("fs");
const parser = new xml2js.Parser();

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports.getAll = async (req, res, next) => {
  const limit = req.query._limit || 20;
  const page = req.query._page || 1;

  function searchTerm() {
    // search
    if (req.query._search) {
      const regex = new RegExp(escapeRegex(req.query._search), "i");
      return [{ invoiceNo: regex }, { taxCode: regex }];
    } else {
      return [{}];
    }
  }

  function filterRoom() {
    // filter room
    if (req.query._filterRoom) {
      return [{ softDelete: null }, { createdRoom: req.query._filterRoom }];
    } else {
      return [{ softDelete: null }];
    }
  }

  function filterStatus() {
    // filter level
    if (req.query._filterStatus) {
      return {
        status: req.query._filterStatus,
      };
    } else {
      return {};
    }
  }

  await Invoice.find({
    $and: filterRoom(),
    $or: searchTerm(),
  })
    .where(filterStatus())
    .skip(limit * page - limit)
    .limit(limit)
    .populate({
      path: "createdUser",
      select: "fullName",
    })
    .populate({
      path: "approvedUser",
      select: "fullName",
    })
    .populate({
      path: "createdRoom",
      select: "name",
    })
    .sort({ createdAt: -1 })
    .exec((error, invoives) => {
      Invoice.countDocuments((error, total) => {
        if (error) return res.status(400).json(error);

        return res.status(200).json({
          invoiceList: invoives.map(formatInvoice),
          paginations: {
            limit,
            page: Number(page),
            count: Math.ceil(total / limit),
            total: invoives.length,
          },
        });
      });
    });
};

function formatInvoice(data) {
  const {
    _id: id,
    taxCode,
    serial,
    invoiceNo,
    invoiceDate,
    seller,
    payment,
    content,
    createdUser,
    createdRoom,
    approvedUser,
    pdfFile,
    xmlFile,
    status,
    inputStatus,
    createdAt,
    updatedAt,
  } = data;
  return {
    id,
    taxCode,
    serial,
    invoiceNo,
    invoiceDate,
    seller,
    payment,
    content,
    createdUser,
    createdRoom,
    approvedUser,
    pdfFile,
    xmlFile,
    status,
    inputStatus,
    createdAt,
    updatedAt,
  };
}

module.exports.get = async (req, res, next) => {
  await Invoice.findById(req.params.id)
    .where({ softDelete: "" })
    .populate("createdUser")
    .exec((error, invoice) => {
      if (error) return res.status(400).json(error);

      return res.status(200).json(invoice);
    });
};

module.exports.xmlRead = async (req, res, next) => {
  function xmlFile() {
    if (req.file) {
      const file = req.file;
      return {
        path: file.path.split("\\").slice(1).join("/"),
        size: file.size,
        name: file.originalname,
        type: file.mimetype,
      };
    } else {
      return res.status(400).json({ message: "Không có file được tải lên." });
    }
  }

  fs.readFile(
    __dirname + `/../public/${xmlFile().path}`,
    function (error, data) {
      parser.parseString(data, function (error, result) {
        if (result && result.HDon) {
          const filteredData = result.HDon.DLHDon.filter((item) => {
            const { TTChung, NDHDon } = item;
            if (TTChung && NDHDon) {
              const { KHHDon, SHDon, NLap } = TTChung[0];
              const { NBan, TToan } = NDHDon[0];
              if (NBan && TToan) {
                const { Ten, MST, DChi } = NBan[0];
                const { TgTTTBSo } = TToan[0];
                return (
                  KHHDon && SHDon && NLap && Ten && MST && DChi && TgTTTBSo
                );
              }
            }
            return false;
          });

          const data = filteredData.map((item) => {
            const { KHHDon, SHDon, NLap } = item.TTChung[0];
            const { Ten, MST, DChi } = item.NDHDon[0].NBan[0];
            const { TgTTTBSo } = item.NDHDon[0].TToan[0];

            return {
              serial: KHHDon,
              invoiceNo: SHDon,
              invoiceDate: NLap,
              seller: Ten,
              taxCode: MST,
              address: DChi,
              payment: TgTTTBSo,
              xmlFile: xmlFile().path,
            };
          });

          res.status(200).json({ invoice: data });
        } else {
          return res.status(400).json({
            message:
              "Máy chủ không thể đọc tệp tin XML được gửi lên, vui lòng nhập thủ công.",
          });
        }
      });
    }
  );
};

module.exports.create = async (req, res, next) => {
  const errors = [];

  function pdfUpload() {
    if (req.files.pdfFile) {
      const file = req.files.pdfFile[0];
      return {
        path: file.path.split("\\").slice(1).join("/"),
        size: file.size,
        name: file.originalname,
        type: file.mimetype,
      };
    } else {
      return;
    }
  }

  function xmlUpload() {
    if (req.files.xmlFile) {
      const file = req.files.xmlFile[0];
      return {
        path: file.path.split("\\").slice(1).join("/"),
        size: file.size,
        name: file.originalname,
        type: file.mimetype,
      };
    } else {
      return {
        path: req.body.xmlFile,
      };
    }
  }

  const validationError = validationResult(req);
  if (!validationError.isEmpty()) {
    Object.keys(validationError.mapped()).forEach((field) => {
      errors.push(validationError.mapped()[field]["msg"]);
    });
  }

  if (errors.length) {
    return res.status(400).json({ message: errors[0] });
  } else {
    await Invoice.create({
      pdfFile: pdfUpload().path,
      xmlFile: xmlUpload().path,
      serial: req.body.serial,
      invoiceNo: req.body.invoiceNo,
      invoiceDate: new Date(req.body.invoiceDate),
      taxCode: req.body.taxCode,
      seller: req.body.seller,
      content: req.body.content,
      payment: req.body.payment,
      createdRoom: req.body.createdRoom,
      createdUser: req.body.createdUser,
      inputStatus: req.body.inputStatus,
      createdAt: Date.now(),
      updatedAt: null,
    })
      .then(() => {
        return res
          .status(200)
          .json({ message: "Thêm mới hóa đơn thành công." });
      })
      .catch((error) => {
        return res.status(400).join({ message: error });
      });
  }
};

module.exports.update = async (req, res, next) => {
  const errors = [];

  function pdfUpload() {
    if (req.files.pdfFile) {
      const file = req.files.pdfFile[0];
      return {
        path: file.path.split("\\").slice(1).join("/"),
        size: file.size,
        name: file.originalname,
        type: file.mimetype,
      };
    }
  }

  function xmlUpload() {
    if (req.files.xmlFile) {
      const file = req.files.xmlFile[0];
      return {
        path: file.path.split("\\").slice(1).join("/"),
        size: file.size,
        name: file.originalname,
        type: file.mimetype,
      };
    }
  }

  const validationError = validationResult(req);
  if (!validationError.isEmpty()) {
    Object.keys(validationError.mapped()).forEach((field) => {
      errors.push(validationError.mapped()[field]["msg"]);
    });
  }

  if (errors.length) {
    return res.status(400).json({ message: errors[0] });
  } else {
    await Invoice.findByIdAndUpdate(
      {
        _id: req.params.id,
      },
      {
        pdfFile: pdfUpload()?.path,
        xmlFile: xmlUpload()?.path,
        serial: req.body.serial,
        invoiceNo: req.body.invoiceNo,
        invoiceDate: new Date(req.body.invoiceDate),
        taxCode: req.body.taxCode,
        seller: req.body.seller,
        content: req.body.content,
        payment: req.body.payment,
        role: req.body.role,
        updatedAtAt: Date.now(),
      }
    )
      .then(() => {
        return res.status(200).json({ message: "Cập nhật thành công." });
      })
      .catch((error) => {
        return res.status(400).json({ message: error });
      });
  }
};

module.exports.delete = async (req, res, next) => {
  await Invoice.updateOne(
    {
      _id: req.params.id,
    },
    {
      softDelete: Date.now(),
    }
  )
    .then(() => {
      return res.status(200).json({ message: "Xóa thành công." });
    })
    .catch((error) => {
      return res.status(400).json({ message: error });
    });
};

module.exports.updateStatus = async (req, res, next) => {
  await Invoice.updateOne(
    {
      _id: req.params.id,
    },
    {
      status: req.body.status,
      approvedUser: req.body.approvedUser,
      updatedAt: Date.now(),
    }
  )
    .then(() => {
      return res.status(200).json({ message: "Duyệt thành công." });
    })
    .catch((error) => {
      return res.status(400).json({ message: error });
    });
};

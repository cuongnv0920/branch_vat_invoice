const Room = require("../models/room.model");
const { validationResult } = require("express-validator");

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports.getAll = async (req, res, next) => {
  const limit = req.query._limit || 10;
  const page = req.query._page || 1;
  console.log(req.query._search);
  function searchTerm() {
    if (req.query._search) {
      const regex = new RegExp(escapeRegex(req.query._search), "i");
      return [{ title: regex }, { code: regex }];
    } else {
      return [{}];
    }
  }

  await Room.find({
    $and: [{ softDelete: null }, {}],
    $or: searchTerm(),
  })
    .skip(limit * page - limit)
    .limit(limit)
    .sort({ sort: 1 })
    .exec((error, rooms) => {
      Room.countDocuments((error, total) => {
        if (error) return res.status(400).json(error);

        return res.status(200).json({
          rooms: rooms.map(formatRoom),
          paginations: {
            limit,
            page: Number(page),
            count: Math.ceil(total / limit),
          },
        });
      });
    });
};

function formatRoom(data) {
  const { _id: id, name, code, sort, createdAt } = data;
  return {
    id,
    name,
    code,
    sort,
    createdAt,
  };
}

module.exports.get = async (req, res, next) => {
  await Room.findById(req.params.id)
    .where({ softDelete: "" })
    .exec((error, room) => {
      if (error) return res.status(400).json(error);

      return res.status(200).json(room);
    });
};

module.exports.create = async (req, res, next) => {
  const errors = [];

  const validationError = validationResult(req);
  if (!validationError.isEmpty()) {
    Object.keys(validationError.mapped()).forEach((field) => {
      errors.push(validationError.mapped()[field]["msg"]);
    });
  }

  if (errors.length) {
    return res.status(400).json({ message: errors[0] });
  } else {
    await Room.create({
      name: req.body.name,
      code: req.body.code,
      sort: req.body.sort,
      createdAt: Date.now(),
    })
      .then(() => {
        return res.status(200).json({ message: "Thêm phòng/ ban thành công." });
      })
      .catch((error) => {
        return res.status(400).json({ message: error });
      });
  }
};

module.exports.update = async (req, res, next) => {
  const errors = [];

  const validationError = validationResult(req);
  if (!validationError.isEmpty()) {
    Object.keys(validationError.mapped()).forEach((field) => {
      errors.push(validationError.mapped()[field]["msg"]);
    });
  }

  if (errors.length) {
    return res.status(400).json({ message: errors });
  } else {
    await Room.updateOne(
      {
        _id: req.params.id,
      },
      {
        name: req.body.name,
        code: req.body.code,
        sort: req.body.sort,
        updatedAt: Date.now(),
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
  await Room.updateOne(
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

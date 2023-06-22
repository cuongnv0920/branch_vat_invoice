const Invoice = require("../models/invoice.model");
const { validationResult } = require("express-validator");
const path = require("path");
const xml2js = require("xml2js");
const fs = require("fs");
const parser = new xml2js.Parser();

module.exports.readXml = async (req, res, next) => {
  function upload() {
    if (req.file) {
      const uploadFile = req.file;

      return {
        path: uploadFile.path.split("\\").slice(1).join("/"),
        size: uploadFile.size,
        originalname: uploadFile.originalname,
        mimetype: uploadFile.mimetype,
      };
    } else {
      return res.status(400).json({ message: "Không có file được tải lên." });
    }
  }

  fs.readFile(
    __dirname + `/../public/${upload().path}`,
    function (error, data) {
      parser.parseString(data, function (error, result) {
        const filteredData = result.HDon.DLHDon.filter((item) => {
          const { TTChung, NDHDon } = item;
          if (TTChung && NDHDon) {
            const { KHHDon, SHDon, NLap } = TTChung[0];
            const { NBan, TToan } = NDHDon[0];
            if (NBan && TToan) {
              const { Ten, MST, DChi } = NBan[0];
              const { TgTTTBSo } = TToan[0];
              return KHHDon && SHDon && NLap && Ten && MST && DChi && TgTTTBSo;
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
          };
        });

        res.status(200).json({ invoice: data });
      });
    }
  );
};

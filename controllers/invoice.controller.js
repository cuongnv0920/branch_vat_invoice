const Invoice = require("../models/invoice.model");
const { validationResult } = require("express-validator");
const path = require("path");
const xml2js = require("xml2js");
const fs = require("fs");

module.exports.readXml = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Không có file được tải lên." });
    }
    console.log(req.file);
    return res.status(200).json({ message: "Tải file thành công." });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error." });
  }
};

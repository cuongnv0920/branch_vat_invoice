const express = require("express");
const router = express.Router();
const validator = require("../validators/invoice.validator");
const controller = require("../controllers/invoice.controller");
const upload = require("../config/storageConf");

router.get("/getAll", controller.getAll);
router.post("/xmlRead", upload.single("xmlFile"), controller.xmlRead);
router.get("/get/:id", controller.get);
router.post(
  "/create",
  upload.fields([
    { name: "xmlFile", maxCount: 1 },
    { name: "pdfFile", maxCount: 1 },
  ]),
  validator.validatorCreate(),
  controller.create
);
router.put(
  "/update/:id",
  upload.fields([
    { name: "xmlFile", maxCount: 1 },
    { name: "pdfFile", maxCount: 1 },
  ]),
  validator.validatorUpdate(),
  controller.update
);
router.put("/delete/:id", controller.delete);
router.put("/updateStatus/:id", controller.updateStatus);

module.exports = router;

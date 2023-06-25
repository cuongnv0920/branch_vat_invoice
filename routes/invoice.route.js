const express = require("express");
const router = express.Router();
const validator = require("../validators/invoice.validator");
const controller = require("../controllers/invoice.controller");
const upload = require("../config/storageConf");

router.get("/getAll", controller.getAll);
router.post("/xmlRead", upload.single("xmlFile"), controller.xmlRead);
// router.get("/get/:id", controller.get);
router.post(
  "/create",
  upload.single("pdfFile"),
  validator.validatorCreate(),
  controller.create
);
// router.put("/update/:id", validator.validatorUpdate(), controller.update);
// router.put("/delete/:id", controller.delete);

module.exports = router;

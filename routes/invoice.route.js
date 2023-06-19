const express = require("express");
const router = express.Router();
const validator = require("../validators/invoice.validator");
const controller = require("../controllers/invoice.controller");
const upload = require("../config/storageConf");

// router.get("/getAll", controller.getAll);
router.post("/readXml", upload.cache.single("upload"), controller.readXml);
// router.get("/get/:id", controller.get);
// router.post("/create", validator.validatorCreate(), controller.create);
// router.put("/update/:id", validator.validatorUpdate(), controller.update);
// router.put("/delete/:id", controller.delete);

module.exports = router;

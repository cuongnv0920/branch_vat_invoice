const express = require("express");
const router = express.Router();
const validator = require("../validators/level.validator");
const controller = require("../controllers/level.controller");

router.get("/getAll", controller.getAll);
router.post("/create", validator.validatorCreate(), controller.create);
router.put("/update/:id", validator.validatorUpdate(), controller.update);
router.put("/delete/:id", controller.delete);

module.exports = router;

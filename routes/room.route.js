const express = require("express");
const router = express.Router();
const validator = require("../validators/room.validator");
const controller = require("../controllers/room.controller");

router.get("/getAll", controller.getAll);
router.get("/get/:id", controller.get);
router.post("/create", validator.validatorCreate(), controller.create);
router.put("/update/:id", validator.validatorUpdate(), controller.update);
router.put("/delete/:id", controller.delete);

module.exports = router;

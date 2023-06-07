const { check } = require("express-validator");
const Level = require("../models/level.model");

const validatorCreate = () => {
  return [
    check("name")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập chức danh.")
      .custom((value) => {
        return Level.exists({ name: value })
          .where({ softDelete: "" })
          .then((level) => {
            if (level) {
              return Promise.reject(
                "Chức danh đã tồn tại, vui lòng nhập chức danh khác."
              );
            }
          });
      }),
  ];
};

const validatorUpdate = () => {
  return [
    check("name")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập chức danh.")
      .custom((value, { req }) => {
        return Level.findOne({
          _id: { $ne: req.params.id },
          name: { $eq: value },
        })
          .where({ softDelete: "" })
          .then((level) => {
            if (level) {
              return Promise.reject(
                "Chức danh đã tồn tại, vui lòng nhập chức danh khác."
              );
            }
          });
      }),
  ];
};

const validator = {
  validatorCreate,
  validatorUpdate,
};

module.exports = validator;

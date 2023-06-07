const { check } = require("express-validator");
const Room = require("../models/room.model");

const validatorCreate = () => {
  return [
    check("name")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập Tên phòng/ ban.")
      .custom((value) => {
        return Room.exists({ name: value })
          .where({ softDelete: "" })
          .then((room) => {
            if (room) {
              return Promise.reject(
                "Tên phòng/ ban đã tồn tại, vui lòng nhập Tên phòng/ ban khác."
              );
            }
          });
      }),

    check("code")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập Mã phòng/ ban.")
      .custom((value) => {
        return Room.exists({ code: value })
          .where({ softDelete: "" })
          .then((room) => {
            if (room) {
              return Promise.reject(
                "Mã phòng/ ban đã tồn tại, vui lòng nhập Mã phòng/ ban khác."
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
      .withMessage("Vui lòng nhập Tên phòng/ ban.")
      .custom((value, { req }) => {
        return Room.findOne({
          _id: { $ne: req.params.id },
          name: { $eq: value },
        })
          .where({ softDelete: "" })
          .then((room) => {
            if (room) {
              return Promise.reject(
                "Tên phòng/ ban đã tồn tại, vui lòng nhập Tên phòng/ ban khác."
              );
            }
          });
      }),

    check("code")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập Mã phòng/ ban.")
      .custom((value, { req }) => {
        return Room.findOne({
          _id: { $ne: req.params.id },
          code: { $eq: value },
        })
          .where({ softDelete: "" })
          .then((room) => {
            if (room) {
              return Promise.reject(
                "Mã phòng/ ban đã tồn tại, vui lòng nhập Mã phòng/ ban khác."
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

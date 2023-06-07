const { check } = require("express-validator");
const User = require("../models/user.model");

const validatorCreate = () => {
  return [
    check("fullName")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập họ và tên người dùng."),

    check("email")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập địa chỉ email người dùng.")
      .custom((value) => {
        return User.exists({ email: value })
          .where({ softDelete: "" })
          .then((user) => {
            if (user) {
              return Promise.reject(
                "Địa chỉ email đã tồn tại, vui lòng nhập địa chỉ email khác."
              );
            }
          });
      }),

    check("password")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập mật khẩu người dùng.")
      .isLength({ min: 6 })
      .withMessage("Mật khẩu phải có ít nhất 6 ký tự."),

    check("retypePassword")
      .not()
      .isEmpty()
      .withMessage("Vui lòng xác nhận lại mật khẩu người dùng.")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Mật khẩu xác nhận không đúng.");
        }

        return true;
      }),

    check("room").not().isEmpty().withMessage("Vui lòng chọn phòng/ ban."),

    check("level").not().isEmpty().withMessage("Vui lòng chọn chức danh."),

    check("phone")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập số điện thoại di động."),

    check("birthday")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập ngày sinh nhật."),
  ];
};

const validatorUpdate = () => {
  return [
    check("fullName")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập họ và tên người dùng."),

    check("email")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập địa chỉ email người dùng.")
      .custom((value, { req }) => {
        return User.findOne({
          _id: { $ne: req.params.id },
          email: { $eq: value },
        })
          .where({ softDelete: "" })
          .then((user) => {
            if (user) {
              return Promise.reject(
                "Địa chỉ email đã tồn tại, vui lòng nhập địa chỉ email khác."
              );
            }
          });
      }),

    check("room").not().isEmpty().withMessage("Vui lòng chọn phòng/ ban."),

    check("level").not().isEmpty().withMessage("Vui lòng chọn chức danh."),

    check("phone")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập số điện thoại di động."),

    check("birthday")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập ngày sinh nhật."),
  ];
};
const validator = {
  validatorCreate,
  validatorUpdate,
};

module.exports = validator;

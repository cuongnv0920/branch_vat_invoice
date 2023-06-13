const { check } = require("express-validator");
const Invoice = require("../models/invoice.model");

const validatorCreate = () => {
  return [
    check("serial")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập Ký hiệu hóa đơn."),

    check("no").not().isEmpty().withMessage("Vui lòng nhập Số hóa đơn."),

    check("date").not().isEmpty().withMessage("Vui lòng chọn Ngày hóa đơn."),

    check("seller")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập tên Đơn vị cung cấp."),

    check("payment")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập Tổng số tiền thanh toán."),

    check("content")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập Nội dung thanh toán."),
  ];
};

const validatorUpdate = () => {
  return [
    check("serial")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập Ký hiệu hóa đơn."),

    check("no").not().isEmpty().withMessage("Vui lòng nhập Số hóa đơn."),

    check("date").not().isEmpty().withMessage("Vui lòng chọn Ngày hóa đơn."),

    check("seller")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập tên Đơn vị cung cấp."),

    check("payment")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập Tổng số tiền thanh toán."),

    check("content")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập Nội dung thanh toán."),
  ];
};
const validator = {
  validatorCreate,
  validatorUpdate,
};

module.exports = validator;

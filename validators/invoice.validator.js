const { check } = require("express-validator");
const Invoice = require("../models/invoice.model");

const validatorCreate = () => {
  return [
    check("taxCode")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập Mã số thuế đơn vị cung cấp.")
      .custom(async (value, { req }) => {
        const existingInvoice = await Invoice.findOne({
          taxCode: value,
          invoiceNo: req.body.invoiceNo,
        });

        if (existingInvoice) {
          throw new Error(
            "Mã số thuế và Số hóa đơn đã tồn tại, vui lòng kiểm tra lại."
          );
        }
      }),

    check("serial")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập Ký hiệu hóa đơn."),

    check("invoiceNo").not().isEmpty().withMessage("Vui lòng nhập Số hóa đơn."),

    check("invoiceDate")
      .not()
      .isEmpty()
      .withMessage("Vui lòng chọn Ngày hóa đơn."),

    check("seller")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập tên Đơn vị cung cấp."),

    check("payment")
      .not()
      .isEmpty()
      .withMessage("Vui lòng nhập Tổng số tiền trên hóa đơn."),

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

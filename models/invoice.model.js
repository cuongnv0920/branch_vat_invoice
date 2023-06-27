const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
  taxCode: {
    type: String,
    require: [true, "Vui lòng nhập mã số thuế của đơn vị cung cấp."],
  },

  serial: {
    type: String,
    require: [true, "Vui lòng nhập Ký hiệu hóa đơn."],
  },

  invoiceNo: {
    type: String,
    require: [true, "Vui lòng nhập Số hóa đơn."],
  },

  invoiceDate: {
    type: Date,
    require: [true, "Vui lòng chọn Ngày hóa đơn."],
  },

  seller: {
    type: String,
    require: [true, "Vui lòng nhập tên Đơn vị cung cấp."],
  },

  payment: {
    type: Number,
    require: [true, "Vui lòng nhập Tổng số tiền thanh toán."],
  },

  content: {
    type: String,
    require: [true, "Vui lòng nhập Nội dung thanh toán."],
  },

  createdUser: {
    type: mongoose.Schema.ObjectId,
    ref: "Users",
  },

  approvedUser: {
    type: mongoose.Schema.ObjectId,
    ref: "Users",
  },

  pdfFile: {
    type: String,
    require: [true, "Vui lòng chọn tệp tin pdf."],
  },

  xmlFile: {
    type: String,
    require: [true, "Vui lòng chọn tệp tin xml."],
  },

  status: {
    type: Boolean,
    default: false,
  },

  inputStatus: {
    type: Boolean,
  },

  softDelete: {
    type: Date,
  },

  createdAt: {
    type: Date,
  },

  updatedAt: {
    type: Date,
  },
});

invoiceSchema.index({ "$**": "text" });
const Invoices = mongoose.model("Invoices", invoiceSchema, "invoices");
const doc = new Invoices();
doc._id instanceof mongoose.Types.ObjectId;

module.exports = Invoices;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
  taxCode: {
    type: String,
    require: [true, "Vui lòng nhập mã số thuế của đơn vị cung cấp."],
  },

  address: {
    type: String,
    require: [true, "Vui lòng nhập địa chỉ đơn vị cung cấp."],
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

  createUser: {
    type: mongoose.Schema.ObjectId,
    ref: "Users",
  },

  approveUser: {
    type: mongoose.Schema.ObjectId,
    ref: "Users",
  },

  file_1: {
    type: String,
    require: [true, "Vui đính kèm file hóa đơn .xml."],
  },

  file_2: {
    type: String,
    require: [true, "Vui đính kèm file hóa đơn .pdf."],
  },

  status: {
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

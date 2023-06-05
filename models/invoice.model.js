const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
  serial: {
    type: String,
    require: [true, "Vui lòng nhập Ký hiệu hóa đơn."],
  },

  no: {
    type: String,
    require: [true, "Vui lòng nhập Số hóa đơn."],
  },

  date: {
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

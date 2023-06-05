const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const levelSchema = new Schema({
  name: {
    type: String,
    require: [true, "Vui lòng nhập tên chức danh."],
  },

  sort: {
    type: Number,
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

levelSchema.index({ "$**": "text" });
const Levels = mongoose.model("Levels", levelSchema, "levels");
const doc = new Levels();
doc._id instanceof mongoose.Types.ObjectId;

module.exports = Levels;

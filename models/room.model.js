const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  name: {
    type: String,
    require: [true, "Vui lòng nhập tên Phòng/ Ban."],
  },

  code: {
    type: String,
    require: [true, "Vui lòng nhập mã Phòng/ Ban."],
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

roomSchema.index({ "$**": "text" });
const Rooms = mongoose.model("Rooms", roomSchema, "rooms");
const doc = new Rooms();
doc._id instanceof mongoose.Types.ObjectId;

module.exports = Rooms;

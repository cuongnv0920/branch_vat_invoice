const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    require: [true, "Vui lòng nhập địa chỉ email."],
    validate: {
      validator: function (email) {
        return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(email);
      },
      message: (props) => `${props.value} Địa chỉ Email không hợp lệ.`,
    },
  },

  username: {
    type: String,
  },

  fullName: {
    type: String,
    require: [true, "Vui lòng nhập họ và tên người dùng."],
  },

  password: {
    type: String,
    require: [true, "Vui lòng nhập mật khẩu."],
  },

  room: {
    type: mongoose.Schema.ObjectId,
    ref: "Rooms",
    require: [true, "Vui lòng chọn Phòng/ Ban quản lý."],
  },

  level: {
    type: mongoose.Schema.ObjectId,
    ref: "Levels",
    require: [true, "Vui lòng chọn chức danh."],
  },

  phone: {
    type: String,
    require: [true, "Vui lòng nhập số điện thoại di động."],
  },

  ext: {
    type: String,
  },

  sex: {
    type: String,
  },

  birthday: {
    type: Date,
  },

  status: {
    type: Boolean,
    default: true,
  },

  role: [
    {
      type: String,
      default: "user",
    },
  ],

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

userSchema.index({ "$**": "text" });
const Users = mongoose.model("Users", userSchema, "users");

const doc = new Users();
doc._id instanceof mongoose.Types.ObjectId;

module.exports = Users;

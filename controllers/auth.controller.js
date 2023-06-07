const User = require("../models/user.model");
const md5 = require("md5");
const jwt = require("jsonwebtoken");

module.exports.login = async (req, res, next) => {
  const username = req.body.username;
  const email = req.body.username;
  const password = md5(req.body.password);

  const user = await User.find({
    $or: [{ username: username }, { email: email }],
  });

  if (!user[0]) {
    return res
      .status(400)
      .json({ message: "Tên đăng nhập không tồn tại, vui lòng kiểm tra lại." });
  }

  if (user[0]?.password !== password) {
    return res
      .status(400)
      .json({ message: "Mật khẩu không đúng, vui lòng kiểm tra lại." });
  }

  const token = jwt.sign({ userId: user._id }, "shhhh");
  return res.status(200).json({
    user: user[0],
    jwt: token,
  });
};

module.exports.loginAdmin = async (req, res, next) => {
  const username = req.body.username;
  const email = req.body.username;
  const password = md5(req.body.password);

  const user = await User.find({
    $or: [{ username: username }, { email: email }],
  });

  if (!user[0]) {
    return res
      .status(400)
      .json({ message: "Tên đăng nhập không tồn tại, vui lòng kiểm tra lại." });
  }

  if (user[0]?.password !== password) {
    return res
      .status(400)
      .json({ message: "Mật khẩu không đúng, vui lòng kiểm tra lại." });
  }

  if (user[0].role[0] === "post") {
    return res.status(400).json({ message: "Bạn không có quyền truy cập." });
  } else {
    const token = jwt.sign({ userId: user._id }, "shhhh");
    return res.status(200).json({
      user: user[0],
      jwt: token,
    });
  }
};

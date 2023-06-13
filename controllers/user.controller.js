const User = require("../models/user.model");
const { validationResult } = require("express-validator");
const md5 = require("md5");
const jwt = require("jsonwebtoken");
const defaultUser = require("../config/defaultUser");

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

User.exists({ email: defaultUser.email }).then((user) => {
  if (!user) {
    return User.create({
      email: defaultUser.email,
      username: defaultUser.username,
      fullName: defaultUser.fullName,
      password: md5(defaultUser.password),
      role: defaultUser.role,
      createdAt: Date.now(),
    });
  }
});

module.exports.getAll = async (req, res, next) => {
  const limit = req.query._limit || 20;
  const page = req.query._page || 1;

  function searchTerm() {
    // search
    if (req.query._search) {
      const regex = new RegExp(escapeRegex(req.query._search), "i");
      return [{ fullName: regex }, { email: regex }];
    } else {
      return [{}];
    }
  }

  function filterRoom() {
    // filter room
    if (req.query._filterRoom) {
      return [{ softDelete: null }, { room: req.query._filterRoom }];
    } else {
      return [{ softDelete: null }];
    }
  }

  function filterLevel() {
    // filter level
    if (req.query._filterLevel) {
      return {
        level: req.query._filterLevel,
      };
    } else {
      return {};
    }
  }

  await User.find({
    $and: filterRoom(),
    $or: searchTerm(),
  })
    .where(filterLevel())
    .skip(limit * page - limit)
    .limit(limit)
    .populate("room")
    .populate("level")
    .sort({ createdAt: 1 })
    .exec((error, users) => {
      User.countDocuments((error, total) => {
        if (error) return res.status(400).json(error);

        return res.status(200).json({
          userList: users.map(formatUser),
          paginations: {
            limit,
            page: Number(page),
            count: Math.ceil(total / limit),
            total: users.length,
          },
        });
      });
    });
};

function formatUser(data) {
  const {
    _id: id,
    fullName,
    email,
    room,
    phone,
    ext,
    level,
    sex,
    role,
    birthday,
    status,
    createdAt,
  } = data;
  return {
    id,
    fullName,
    email,
    room,
    phone,
    ext,
    level,
    sex,
    role,
    birthday,
    status,
    createdAt,
  };
}

module.exports.get = async (req, res, next) => {
  await User.findById(req.params.id)
    .where({ softDelete: "" })
    .populate("room")
    .populate("level")
    .exec((error, user) => {
      if (error) return res.status(400).json(error);

      return res.status(200).json(user);
    });
};

module.exports.create = async (req, res, next) => {
  const email = req.body.email;
  const username = email.substring(0, email.indexOf("@"));
  const token = jwt.sign({ user: "register" }, "shhhhh");
  const errors = [];

  const validationError = validationResult(req);
  if (!validationError.isEmpty()) {
    Object.keys(validationError.mapped()).forEach((field) => {
      errors.push(validationError.mapped()[field]["msg"]);
    });
  }

  if (errors.length) {
    return res.status(400).json({ message: errors[0] });
  } else {
    await User.create({
      fullName: req.body.fullName,
      email: email,
      username: username,
      password: md5(req.body.password),
      room: req.body.room,
      level: req.body.level,
      phone: req.body.phone,
      ext: req.body?.ext,
      sex: req.body.sex,
      role: req.body.role,
      birthday: new Date(req.body.birthday),
      createdAt: Date.now(),
    })
      .then((user) => {
        return res.status(200).json({
          jwt: token,
          user: user,
        });
      })
      .catch((error) => {
        return res.status(400).json({ message: error });
      });
  }
};

module.exports.update = async (req, res, next) => {
  const email = req.body.email;
  const username = email.substring(0, email.indexOf("@"));

  function hashPassword() {
    if (req.body.password) {
      return md5(req.body.password);
    }
  }

  const errors = [];

  const validationError = validationResult(req);
  if (!validationError.isEmpty()) {
    Object.keys(validationError.mapped()).forEach((field) => {
      errors.push(validationError.mapped()[field]["msg"]);
    });
  }

  if (errors.length) {
    return res.status(400).json({ message: errors });
  } else {
    await User.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        fullName: req.body.fullName,
        email: email,
        username: username,
        password: hashPassword(),
        room: req.body.room,
        level: req.body.level,
        phone: req.body.phone,
        ext: req.body?.ext,
        sex: req.body.sex,
        role: req.body.role,
        birthday: new Date(req.body.birthday),
        updatedAt: Date.now(),
      },
      {
        new: true,
      }
    )
      .then((user) => {
        return res.status(200).json({
          user: user,
        });
      })
      .catch((error) => {
        return res.status(400).json({ message: error });
      });
  }
};

module.exports.delete = async (req, res, next) => {
  await User.updateOne(
    {
      _id: req.params.id,
    },
    {
      softDelete: Date.now(),
    }
  )
    .then(() => {
      return res.status(200).json({ message: "Xóa thành công." });
    })
    .catch((error) => {
      return res.status(400).json({ message: error });
    });
};

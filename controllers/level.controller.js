const Level = require("../models/level.model");
const { validationResult } = require("express-validator");

module.exports.getAll = async (req, res, next) => {
  await Level.find()
    .where({ softDelete: "" })
    .sort({ sort: 1 })
    .exec((error, levels) => {
      if (error) return res.status(400).json(error);

      return res.status(200).json(levels.map(formatLevel));
    });
};

function formatLevel(data) {
  const { _id: id, name, sort, createdAt } = data;
  return {
    id,
    name,
    sort,
    createdAt,
  };
}

module.exports.create = async (req, res, next) => {
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
    await Level.create({
      name: req.body.name,
      sort: req.body.sort,
      createdAt: Date.now(),
    })
      .then(() => {
        return res.status(200).json({ message: "Thêm chức danh thành công." });
      })
      .catch((error) => {
        return res.status(400).json({ message: error });
      });
  }
};

module.exports.update = async (req, res, next) => {
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
    await Level.updateOne(
      {
        _id: req.params.id,
      },
      {
        name: req.body.name,
        sort: req.body.sort,
        updatedAt: Date.now(),
      }
    )
      .then(() => {
        return res.status(200).json({ message: "Cập nhật thành công." });
      })
      .catch((error) => {
        return res.status(400).json({ message: error });
      });
  }
};

module.exports.delete = async (req, res, next) => {
  await Level.updateOne(
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

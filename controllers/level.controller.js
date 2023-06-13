const Level = require("../models/level.model");
const { validationResult } = require("express-validator");

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports.getAll = async (req, res, next) => {
  const limit = req.query._limit || 20;
  const page = req.query._page || 1;

  function searchTerm() {
    if (req.query._search) {
      const regex = new RegExp(escapeRegex(req.query._search), "i");
      return [{ name: regex }];
    } else {
      return [{}];
    }
  }
  await Level.find({
    $and: [{ softDelete: null }],
    $or: searchTerm(),
  })
    .skip(limit * page - limit)
    .limit(limit)
    .sort({ sort: 1 })
    .exec((error, levels) => {
      Level.countDocuments((error, total) => {
        if (error) return res.status(400).json(error);

        return res.status(200).json({
          levelList: levels.map(formatLevel),
          paginations: {
            limit,
            page: Number(page),
            count: Math.ceil(total / limit),
            total: levels.length,
          },
        });
      });
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

module.exports.get = async (req, res, next) => {
  await Level.findById(req.params.id)
    .where({ softDelete: "" })
    .exec((error, level) => {
      if (error) return res.status(400).json(error);

      return res.status(200).json(level);
    });
};

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

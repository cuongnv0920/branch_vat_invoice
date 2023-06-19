const multer = require("multer");

const cacheStorage = multer.diskStorage({
  destination: (req, file, cd) => {
    cd(null, "./public/cache/");
  },
  filename: (req, file, cd) => {
    cd(null, Date.now() + "-" + file.originalname);
  },
});

const cacheConfig = multer({
  storage: cacheStorage,
  limits: {
    fileSize: "8mb",
  },
});

const uploadStorage = multer.diskStorage({
  destination: (req, file, cd) => {
    cd(null, "./public/uploads/");
  },
  filename: (req, file, cd) => {
    cd(null, Date.now() + "-" + file.originalname);
  },
});

const uploadConfig = multer({
  storage: uploadStorage,
  limits: {
    fileSize: "8mb",
  },
});

const uploads = {
  cache: cacheConfig,
  uploads: uploadConfig,
};

module.exports = uploads;

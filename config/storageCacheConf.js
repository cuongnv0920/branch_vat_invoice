const multer = require("multer");

const storageCache = multer.diskStorage({
  destination: (req, file, cd) => {
    cd(null, "./public/cache/");
  },
  filename: (req, file, cd) => {
    cd(null, Date.now() + "-" + file.originalname);
  },
});

const uploadCache = multer({
  storage: storageCache,
  limits: {
    fileSize: "8mb",
  },
});

module.exports = uploadCache;

const multer = require("multer");

const temporatyStorage = multer.diskStorage({
  destination: (req, file, cd) => {
    cd(null, "./public/temporary/");
  },
  filename: (req, file, cd) => {
    cd(null, Date.now() + "-" + file.originalname);
  },
});

const temporatyConfig = multer({
  storage: temporatyStorage,
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
  temporaty: temporatyConfig,
  uploads: uploadConfig,
};

module.exports = uploads;

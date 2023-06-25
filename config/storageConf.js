const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cd) => {
    cd(null, "./public/uploads/");
  },
  filename: (req, file, cd) => {
    cd(null, Date.now() + "-" + file.originalname);
  },
});

const uploads = multer({
  storage: storage,
  limits: {
    fileSize: "8mb",
  },
});

module.exports = uploads;

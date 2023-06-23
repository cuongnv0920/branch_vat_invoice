const multer = require("multer");

const xmlStorage = multer.diskStorage({
  destination: (req, file, cd) => {
    cd(null, "./public/xmlUpload/");
  },
  filename: (req, file, cd) => {
    cd(null, Date.now() + "-" + file.originalname);
  },
});

const xmlConfig = multer({
  storage: xmlStorage,
  limits: {
    fileSize: "8mb",
  },
});

const pdfStorage = multer.diskStorage({
  destination: (req, file, cd) => {
    cd(null, "./public/pdfUpload/");
  },
  filename: (req, file, cd) => {
    cd(null, Date.now() + "-" + file.originalname);
  },
});

const pdfConfig = multer({
  storage: pdfStorage,
  limits: {
    fileSize: "8mb",
  },
});

const uploads = {
  xml: xmlConfig,
  pdf: pdfConfig,
};

module.exports = uploads;

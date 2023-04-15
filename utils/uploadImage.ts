import multer from "multer";
import path from "path";

// define storage options for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./upload");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

export const uploadImage = multer({ storage });

import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const staticFolder = req.query.staticFolder || "./public";

    return cb(null, staticFolder);
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}_${file.originalname}`;
    return cb(null, fileName);
  },
});

const upload = multer({
  storage,
});

export default upload;

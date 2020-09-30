// @ts-ignore
import multer from 'multer';

const storage: multer.StorageEngine = multer.memoryStorage();
const fileFilter = (req: any, file: any, cb: any) => {
  if (
    file.mimetype == 'image/png' ||
    file.mimetype == 'image/jpg' ||
    file.mimetype == 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb({ message: 'this file is not an image file' }, false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
});

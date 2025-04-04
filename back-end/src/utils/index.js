import url from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

export const deleteFile = fileName => {
  const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

  // __dirname gives whole folderpath
  const directoryPath = path.join(__dirname, `../../public/${fileName}`);

  if (fs.existsSync(directoryPath)) {
    console.log('Directory exists. Deleting...');
    fs.unlinkSync(directoryPath);
  }
};

export * from './token.js';
export * from './apiResponseHandler.js';
export * from './asyncErrorHandler.js';
export * from './createError.js';
export * from './mail.js';


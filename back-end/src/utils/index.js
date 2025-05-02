import url from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import { randomInt } from 'node:crypto';

export const deleteFile = fileName => {
  const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

  // __dirname gives whole folderpath
  const directoryPath = path.join(__dirname, `../../public/${fileName}`);

  if (fs.existsSync(directoryPath)) {
    console.log('Directory exists. Deleting...');
    fs.unlinkSync(directoryPath);
  }
};

export const getProductFeatureInSingleString = product => {
  return `${product.name} ${product.description} ${
    product.category
  } ${product.sizes.join(' ')} ${product.colors.join(' ')}`;
};

export const generateOtp = () => {
  const code = randomInt(100000, 999999);

  return {
    code,
    expires: new Date(Date.now() + 5 * 60 * 1000),
  };
};

export * from './token.js';
export * from './apiResponseHandler.js';
export * from './asyncErrorHandler.js';
export * from './createError.js';
export * from './mail.js';



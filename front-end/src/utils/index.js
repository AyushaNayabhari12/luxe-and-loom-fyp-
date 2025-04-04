import { SERVER_URL } from '../config';

export const formatImageUrl = url => {
  console.log(typeof url);

  if (!url) {
    return;
  }

  if (typeof url === 'object') {
    return URL.createObjectURL(url);
  }

  if (url.startsWith('https://')) {
    return url;
  }

  return `${SERVER_URL}/${url}`;
};


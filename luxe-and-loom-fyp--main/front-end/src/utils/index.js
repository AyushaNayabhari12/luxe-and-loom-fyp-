import { SERVER_URL } from "../config";

export const formatImageUrl = (url) => {
  if (!url) {
    return;
  }

  if (typeof url === "object") {
    return URL.createObjectURL(url);
  }

  if (url.startsWith("https://")) {
    return url;
  }

  return `${SERVER_URL}/${url}`;
};

export function base64ToFile(base64String, filename = "customized_shawl.png") {
  const arr = base64String.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]); // decode Base64 string
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}

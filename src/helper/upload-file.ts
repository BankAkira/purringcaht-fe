// import environment from '../environment';
import { getSignedUrlApi } from '../rest-api/common';

export const uploadBatchFile = async (files: File[]) => {
  const urls = Array<string>();
  for (const file of files) {
    const url = await uploadFile(file);
    urls.push(url);
  }

  return urls;
};

export const uploadFile = async (file: File) => {
  const fileName = `${Date.now()}-${file.name.split(' ').join('')}`;
  const { signedUrl, publicUrl } = await getSignedUrlApi(fileName);
  const uploadResponse = await upload(signedUrl, file);
  if (uploadResponse.status !== 200) return '';
  // const url = getFileUrl(fileName);
  return publicUrl;
};

const upload = async (signedUrl: string, file: File) => {
  const option = {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  };
  const uploadResponse = await fetch(signedUrl, option);
  return uploadResponse;
};

// const getFileUrl = (fileName: string) => {
//   const { url: firebaseStorageUrl, replaceKey } = environment.firebaseStorage;
//   const encodePath = fileName.toString().split('/').join('%2F');
//   const fileUrl = firebaseStorageUrl.replace(replaceKey, encodePath);
//   return fileUrl;
// };

export const base64toFile = (dataurl: string, filename: string) => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[arr.length - 1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  const file = new File([u8arr], filename, { type: mime });
  return file;
};

export const filetoBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });

export const convertToStoredFiles = async (files: File[]) => {
  return await Promise.all(
    files.map(async f => {
      const base64 = await filetoBase64(f);
      const fileName = f.name;
      return { base64, fileName };
    })
  );
};

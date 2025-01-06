import { MessageOptional } from '../type/message';

export const getFileOptional = (file: File) => {
  const optional: MessageOptional = {
    fileSize: file.size,
    fileName: file.name,
    fileType: file.type,
    lastModified: file.lastModified,
  };
  return optional;
};

export const getPdfPageCount = async (file: File): Promise<number | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onloadend = function () {
      if (!reader.result) {
        return resolve(null);
      }
      if (typeof reader.result !== 'string') {
        return resolve(null);
      }
      const match = reader.result.match(/\/Type[\s]*\/Page[^s]/g);

      if (!match?.length) {
        return resolve(null);
      }

      resolve(match.length);
    };
    reader.onerror = error => reject(error);
  });
};

export const downloadFile = (base64: string, fileName?: string) => {
  const a = document.createElement('a');
  a.href = base64;
  a.download = fileName || 'Untitled';
  a.click();
};

export const isImage = (file: File) => file.type.match('image.*');
export const isVideo = (file: File) => file.type.match('video.*');

export const getFileCategory = (fileType?: string) => {
  if (!fileType) {
    return 'unknown';
  }
  const imageTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/bmp',
    'image/tiff',
  ];
  const videoTypes = [
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-matroska',
  ];
  const pdfType = 'application/pdf';

  if (imageTypes.includes(fileType)) {
    return 'image';
  } else if (videoTypes.includes(fileType)) {
    return 'video';
  } else if (fileType === pdfType) {
    return 'pdf';
  } else {
    return 'unknown';
  }
};

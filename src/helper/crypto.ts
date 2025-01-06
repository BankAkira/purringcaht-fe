import { Buffer } from 'buffer';
import { MessageContentType } from '../type/message';
import { CryptoAES256 } from './rsa-crypto';
import { Logger } from './logger';

const log = new Logger('crypto.ts');

export const fileToBase64 = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
};

export const plainTextToBase64 = (text: string) => {
  return Buffer.from(text).toString('base64');
};

export const base64ToPlainText = (base64: string) => {
  return Buffer.from(base64, 'base64').toString('utf-8');
};

export const encryptMessage = async (
  message: string | File,
  contentType: MessageContentType,
  chatScheme: CryptoAES256 | null
) => {
  if (!chatScheme) {
    throw new Error('chatScheme is empty');
  }

  switch (contentType) {
    case MessageContentType.TEXT:
    case MessageContentType.STICKER: {
      if (typeof message !== 'string') {
        throw new Error('message must be string');
      }
      const buf = Buffer.from(message);
      const cypher = chatScheme.encrypt(buf);
      const encryptMessage = cypher.toString('hex');
      return encryptMessage;
    }

    case MessageContentType.IMAGE:
    case MessageContentType.VIDEO:
    case MessageContentType.FILE: {
      if (!(message instanceof File)) {
        throw new Error('message must be file');
      }
      const base64 = await fileToBase64(message);
      return chatScheme.encrypt(Buffer.from(base64)).toString('hex');
    }

    default:
      throw new Error('Content type not support.');
  }
};

export const decryptMessage = async (
  encryptMessage: string,
  contentType: MessageContentType,
  chatScheme: CryptoAES256 | null
) => {
  if (!chatScheme) {
    throw new Error('chatScheme is empty');
  }

  try {
    switch (contentType) {
      case MessageContentType.NOTIFICATION: {
        return encryptMessage;
      }
      case MessageContentType.TEXT:
      case MessageContentType.STICKER: {
        const cypher = Buffer.from(encryptMessage, 'hex');
        const text = chatScheme.decrypt(cypher).toString();
        return text;
      }
      case MessageContentType.IMAGE:
      case MessageContentType.VIDEO:
      case MessageContentType.FILE: {
        const resp = await fetch(encryptMessage);
        const cypher = await resp.text();
        const base64 = chatScheme
          .decrypt(Buffer.from(cypher, 'hex'))
          .toString();
        return base64;
      }
      default:
        throw new Error('Content type not support.');
    }
  } catch (error) {
    log.error(error);
    return 'Unsupport Message';
  }
};

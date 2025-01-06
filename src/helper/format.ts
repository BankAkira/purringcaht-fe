import { Logger } from './logger';

const log = new Logger('format.ts');

export const trimString = (text: string, subStringLength = 20) => {
  if (!text) return '';

  if (text.length <= subStringLength) return text;

  return `${text.substring(0, subStringLength)}....`;
};

export async function urlToFile(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch the file');
    }
    const blob = await response.blob();
    return new File([blob], 'filename.jpg', { type: 'image/jpeg' }); // Adjust filename and type as needed
  } catch (error) {
    log.error('Error converting URL to file:', error);
    return null;
  }
}

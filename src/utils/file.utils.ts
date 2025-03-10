import * as fs from 'fs';
import * as path from 'path';

export function generateRandomNumber(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getUniqueFileName(fileName: string): string {
  const fileExt = path.extname(fileName);
  const baseName = path.basename(fileName, fileExt);
  return `${baseName}_${generateRandomNumber()}${fileExt}`;
}

export function saveFile(file: Express.Multer.File, customFileName?: string): string {
  if (!file || typeof file.originalname !== 'string' || !Buffer.isBuffer(file.buffer)) {
    throw new Error('Invalid file object provided');
  }

  const uploadDir = path.join(process.cwd(), 'docs');

  // Create docs directory if it doesn't exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const fileName = customFileName || getUniqueFileName(file.originalname);
  const filePath = path.join(uploadDir, fileName);

  fs.writeFileSync(filePath, file.buffer);

  return filePath;
}

export function deleteFile(filePath: string): boolean {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}

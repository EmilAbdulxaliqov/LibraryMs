export type PhotoType = 'image/png' | 'image/jpeg' | 'image/jpg';

export interface BufferedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: PhotoType;
  size: number;
  buffer: Buffer | string;
}

export interface HasFile {
  file: Buffer | string;
}

export interface StoredFileMetadata {
  id: string;
  name: string;
  encoding: string;
  mimetype: PhotoType;
  size: number;
  updatedAt: Date;
  fileSrc: string;
}

export interface StoredFile extends HasFile, StoredFileMetadata {}

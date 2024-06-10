import { BadRequestException, Injectable } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { BufferedFile } from './types/file.types';
import { url } from 'inspector';

@Injectable()
export class MinioClientService {
  //  || 'test_minio'
  private readonly bucketName = process.env.MINIO_BUCKET;

  constructor(private readonly minioClient: MinioService) {}

  public get client() {
    return this.minioClient.client;
  }

  async getSingleFile(fileName: string, baseBucket: string = this.bucketName) {
    let file = await this.client.getObject(baseBucket, fileName);
    // console.log('file:', file);
    return file;
  }

  async getProfileImage(fileName: string) {
    return `${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${this.bucketName}/${fileName}`;
  }

  async uploadFile(file: BufferedFile, baseBucket: string = this.bucketName) {
    if (
      !(
        file.mimetype.includes('png') ||
        file.mimetype.includes('jpeg') ||
        file.mimetype.includes('jpg')
      )
    ) {
      throw new BadRequestException('Invalid file type');
    }

    let tempFileName = `${Date.now()}-${file.originalname}`;

    await this.client.putObject(
      baseBucket,
      tempFileName,
      file.buffer,
      file.size,
      { 'Content-Type': file.mimetype },
      function (err, res) {
        if (err) {
          console.log(err);
          throw new BadRequestException('Error uploading file');
        }
      },
    );

    return {
      url: `${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}/${baseBucket}/${tempFileName}`,
    };
  }
}

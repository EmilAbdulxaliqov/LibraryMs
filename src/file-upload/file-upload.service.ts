import { BadRequestException, Injectable } from '@nestjs/common';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { BufferedFile } from 'src/minio-client/types/file.types';

@Injectable()
export class FileUploadService {
  constructor(private minioClientService: MinioClientService) {}

  async getSingleFile(fileName: string) {
    try {
      let file = await this.minioClientService.getSingleFile(fileName);
      if (!file) {
        throw new BadRequestException('File not found');
      }
      return file;
    } catch (error) {
      throw new BadRequestException('File not found');
    }
  }
  async uploadSingleFile(image: BufferedFile) {
    let uploadedImage = await this.minioClientService.uploadFile(image);

    return {
      imageUrl: uploadedImage.url,
      message: 'File uploaded successfully to MinIO!',
    };
  }

  async getProfileImage(fileName: string) {
    return await this.minioClientService.getProfileImage(fileName);
  }
}

import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BufferedFile } from 'src/minio-client/types/file.types';
import { FileUploadService } from './file-upload.service';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('file-upload')
@SkipThrottle()
export class FileUploadController {
  constructor(private fileUploadService: FileUploadService) {}

  @Get(':fileName')
  async getSingleFile(@Param('fileName') fileName: string, @Res() response) {
    return (await this.fileUploadService.getSingleFile(fileName)).pipe(
      response,
    );
  }

  @Get('profile/:fileName')
  async getProfileImage(@Param('fileName') fileName: string) {
    return await this.fileUploadService.getProfileImage(fileName);
  }

  @Post('single')
  @UseInterceptors(FileInterceptor('image'))
  async uploadSingleFile(@UploadedFile() image: BufferedFile) {
    return await this.fileUploadService.uploadSingleFile(image);
  }
}

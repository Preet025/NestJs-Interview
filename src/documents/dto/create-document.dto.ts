import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiProperty({
    description: 'Name of the uploaded file',
    example: 'user-profile.pdf',
  })
  fileName: string;

  @ApiProperty({
    description: 'MIME type of the file',
    example: 'application/pdf',
  })
  fileType: string;

  @ApiProperty({
    description: 'Size of the file in bytes',
    example: 204800, // example: 200 KB
  })
  fileSize: number;
}

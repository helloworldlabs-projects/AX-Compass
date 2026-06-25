import { UploadedFile, UploadedFileDto } from '@/types/file';
import { apiFetch } from '../client';

const mapUploadedFile = (dto: UploadedFileDto): UploadedFile => ({
  fileName: dto.fileName,
  publicUrl: dto.publicUrl,
});

export const fileService = {
  uploadFile: async (file: File): Promise<UploadedFile> => {
    const formData = new FormData();
    formData.append('file', file);

    const dto = await apiFetch<UploadedFileDto>('/files', {
      method: 'POST',
      body: formData,
      // Content-Type 헤더를 명시하지 않아 브라우저가 multipart/form-data boundary를 자동 설정하도록 함.
      // apiFetch 기본값인 'application/json'을 제거하기 위해 undefined로 오버라이드.
      headers: {
        'Content-Type': undefined as unknown as string,
      },
    });

    return mapUploadedFile(dto);
  },
};

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
    });

    return mapUploadedFile(dto);
  },
};

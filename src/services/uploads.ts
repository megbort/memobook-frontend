import { send } from './apiClient';

export type UploadKind = 'avatar' | 'media';

export interface UploadSignature {
  uploadUrl: string;
  apiKey: string;
  signature: string;
  params: Record<string, string | number | boolean>;
}

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  resource_type: 'image' | 'video' | 'raw';
  format: string;
  bytes: number;
  width?: number;
  height?: number;
}

const readCloudinaryError = (xhr: XMLHttpRequest) => {
  try {
    return JSON.parse(xhr.responseText).error?.message ?? `Upload failed (${xhr.status})`;
  } catch {
    return `Upload failed (${xhr.status})`;
  }
};

export const uploadApi = {
  getSignature: (contactId: string, kind: UploadKind) =>
    send<UploadSignature>('POST', `/contacts/${contactId}/uploads/signature`, { kind }),

  // XMLHttpRequest instead of fetch because fetch can't report upload progress.
  uploadToCloudinary(
    file: File,
    { uploadUrl, apiKey, signature, params }: UploadSignature,
    onProgress?: (percent: number) => void,
  ): Promise<CloudinaryUploadResult> {
    const form = new FormData();
    form.append('file', file);
    form.append('api_key', apiKey);
    form.append('signature', signature);
    Object.entries(params).forEach(([name, value]) => form.append(name, String(value)));

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', uploadUrl);
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) onProgress?.(Math.round((event.loaded / event.total) * 100));
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve(JSON.parse(xhr.responseText));
        else reject(new Error(readCloudinaryError(xhr)));
      };
      xhr.onerror = () => reject(new Error('Network error during upload'));
      xhr.send(form);
    });
  },

  async uploadFile(
    contactId: string,
    kind: UploadKind,
    file: File,
    onProgress?: (percent: number) => void,
  ): Promise<CloudinaryUploadResult> {
    const signature = await uploadApi.getSignature(contactId, kind);
    return uploadApi.uploadToCloudinary(file, signature, onProgress);
  },

  uploadAvatar: async (
    contactId: string,
    file: File,
    onProgress?: (percent: number) => void,
  ): Promise<string> => {
    const uploaded = await uploadApi.uploadFile(contactId, 'avatar', file, onProgress);
    return uploaded.secure_url;
  },
};

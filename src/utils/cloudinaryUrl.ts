const CLOUDINARY_UPLOAD_SEGMENT = '/upload/';

export const withCloudinaryTransformation = (url: string, transformation: string) => {
  if (!url.startsWith('https://res.cloudinary.com/') || !url.includes(CLOUDINARY_UPLOAD_SEGMENT)) {
    return url;
  }
  return url.replace(CLOUDINARY_UPLOAD_SEGMENT, `${CLOUDINARY_UPLOAD_SEGMENT}${transformation}/`);
};

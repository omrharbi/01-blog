export interface PostRequest {
  htmlContent?: string
  title?: string,
  excerpt: string,
  medias: MediaRequest[]
}
export interface MediaRequest {
  filename?: string;
  filePath?: string;
  fileType?: string;
  fileSize?: number;
  displayOrder?: number;
}

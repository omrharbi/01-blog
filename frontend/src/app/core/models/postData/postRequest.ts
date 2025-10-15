export interface PostRequest {
  htmlContent?: string
  title?: string,
  content?: string,
  excerpt: string,
  medias: MediaRequest[]
  tags: Tags[]
}
export interface MediaRequest {
  filename?: string;
  filePath?: string;
  fileType?: string;
  fileSize?: number;
  displayOrder?: number;
}

export interface Tags {
  tag?: string;
}


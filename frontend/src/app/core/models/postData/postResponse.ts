export interface PostResponse {
  _id: number,
  title?: string,
  content: string,
  htmlContent?: string
  excerpt?: string,
  medias?: MediaRequest[]
}
export interface MediaRequest {
  filePath?: string;
  displayOrder?: number;
  filename: string;
}

export interface ApiResponse<T> {
  status?: boolean;
  message?: string;
  error?: string;
  data: T;
}

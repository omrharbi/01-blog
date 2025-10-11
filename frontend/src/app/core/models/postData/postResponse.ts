export interface PostResponse {
  _id: number,
  title?: string,
  content: string,
  htmlContent?: string
  excerpt?: string,
  medias?: MediaResponse[]
}
export interface MediaResponse {
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

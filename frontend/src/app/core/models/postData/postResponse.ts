export interface PostResponse {
  _id: number,
  htmlContent?: string
  title?: string,
  excerpt?: string,
  medias?: MediaRequest[]
}
export interface MediaRequest {
  filePath?: string;
  displayOrder?: number;
}

export interface ApiResponse<T> {
  status?: boolean;
  message?: string;
  error?: string;
  data: T;
}

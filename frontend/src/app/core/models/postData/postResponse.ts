export interface PostResponse {
  _id: number,
  title?: string,
  content: string,
  htmlContent?: string
  excerpt?: string,
  firstname?: string,
  lastname?: string,
  createdAt: string;
  medias?: MediaResponse[]
  tags?: Tags[]
}
export interface MediaResponse {
  filePath?: string;
  displayOrder?: number;
  filename: string;
}
export interface Tags {
  _id?: number;
  tag?: string;
}


export interface ApiResponse<T> {
  status?: boolean;
  message?: string;
  error?: string;
  data: T;
}

export interface PostResponse {
  id: number,
  title: string,
  content: string,
  firstImage:string,
  htmlContent: string
  excerpt: string,
  firstname?: string,
  lastname?: string,
  avater_user?: string,
  createdAt: string;
  medias?: MediaResponse[]
  tags?: Tags[]
}
export interface MediaResponse {
  filePath: string;
  displayOrder: number;
  filename: string;
  fileType: string;
  fileSize: number;
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

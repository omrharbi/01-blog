export interface PostResponse {
  id: string;
  title: string;
  content: string;
  firstImage: string;
  htmlContent: string;
  excerpt: string;
  username: string;
  firstname?: string;
  lastname?: string;
  avater_user?: string;
  createdAt: string;
  medias?: MediaResponse[];
  tags?: Tags[];
  liked: boolean;
  likesCount: number;
  commentCount: number;
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

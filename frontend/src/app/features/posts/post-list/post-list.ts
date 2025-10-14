import { Component, } from '@angular/core';
import { Materaile } from '../../../modules/materaile-module';
import { PostService } from '../../../core/service/servicesAPIREST/create-posts/post-service';
import { ActivatedRoute, } from '@angular/router';
import { PostResponse } from '../../../core/models/postData/postResponse';
import { apiUrl } from '../../../core/constant/constante';
import { PreviewService } from '../../../core/service/serivecLogique/preview/preview.service';
import { Comment } from '../../comment/comment';
import { UploadImage } from '../../../core/service/serivecLogique/upload-images/upload-image';

@Component({
  selector: 'app-post-list',
  imports: [Materaile,Comment],
  templateUrl: './post-list.html',
  styleUrl: './post-list.scss'
})
export class PostList {
  constructor(private postSerivce: PostService, private preview: PreviewService, private route: ActivatedRoute,private replceimge :UploadImage) { }
  apiUrl = apiUrl
  post: PostResponse = {
    id: 0,
    title: "",
    content: "",
    htmlContent: "",
    excerpt: "",
    createdAt:"",
    medias: [],
    tags: []
  };
  loading: boolean = true;
  error: string = '';
  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params["id"];
      this.postSerivce.getpostByID(id).subscribe({
        next: (response) => {
          this.post = response.data;
          let htmlContent = this.replceimge.replaceImage(this.post.htmlContent ?? "",this.post );
          this.post.htmlContent = this.preview.renderMarkdownWithMedia(htmlContent); htmlContent;

        },
        error: (error) => {
          console.log("error to get post", error);

        }
      })
    })
  }

 
}

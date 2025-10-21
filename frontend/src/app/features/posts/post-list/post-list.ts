import { ChangeDetectorRef, Component, ElementRef, ViewChild, } from '@angular/core';
import { Materaile } from '../../../modules/materaile-module';
import { PostService } from '../../../core/service/servicesAPIREST/create-posts/post-service';
import { ActivatedRoute, } from '@angular/router';
import { PostResponse } from '../../../core/models/post/postResponse';
import { apiUrl } from '../../../core/constant/constante';
import { PreviewService } from '../../../core/service/serivecLogique/preview/preview.service';
import { Comment } from '../../comment/comment';
import { UploadImage } from '../../../core/service/serivecLogique/upload-images/upload-image';
import { likeResponse } from '../../../core/models/like/likeResponse';
import { likesServiceLogique } from '../../../core/service/serivecLogique/like/likes-service-logique';

@Component({
  selector: 'app-post-list',
  imports: [Materaile, Comment],
  templateUrl: './post-list.html',
  styleUrl: './post-list.scss'
})
export class PostList {
  constructor(private postSerivce: PostService, private preview: PreviewService,
    private route: ActivatedRoute, private replceimge: UploadImage,
    private like: likesServiceLogique,
    private cdr: ChangeDetectorRef) { }
  apiUrl = apiUrl
   @ViewChild('commentsSection') commentsSection!: ElementRef;
  post: PostResponse = {
    id: "",
    title: "",
    content: "",
    firstImage: "",
    htmlContent: "",
    excerpt: "",
    createdAt: "",
    medias: [],
    tags: [],
    liked: false,
    likesCount: 0,
    commentCount: 0,
  };
  loading: boolean = true;
  error: string = '';
  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params["id"];
      this.postSerivce.getpostByID(id).subscribe({
        next: (response) => {
          Object.assign(this.post, response.data);
          let htmlContent = this.replceimge.replaceImage(this.post.htmlContent ?? "", this.post);
          this.post.htmlContent = this.preview.renderMarkdownWithMedia(htmlContent); htmlContent;
        
          console.log(response.data);
          
        },
        error: (error) => {
          console.log("error to get post", error);

        }
      })
    })
  }

  toggleLikePost(postId: string, post: PostResponse) {
    this.like.toggleLikePost(postId, post);
    this.cdr.detectChanges();
  }


}

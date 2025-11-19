import { ChangeDetectorRef, Component, ElementRef, QueryList, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, switchMap, count } from 'rxjs';

import { Materaile } from '../../../modules/materaile-module';
import { PostService } from '../../../core/service/servicesAPIREST/posts/post-service';
import { PostResponse } from '../../../core/models/post/postResponse';
import { apiUrl } from '../../../core/constant/constante';
import { PreviewService } from '../../../core/service/serivecLogique/preview/preview.service';
import { Comment } from '../../comment/comment';
import { UploadImage } from '../../../core/service/serivecLogique/upload-images/upload-image';
import { likesServiceLogique } from '../../../core/service/serivecLogique/like/likes-service-logique';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago-pipe';

@Component({
  selector: 'app-post-list',
  imports: [Materaile, Comment, TimeAgoPipe],
  templateUrl: './post-list.html',
  styleUrls: ['./post-list.scss']
})
export class PostList {

  apiUrl = apiUrl;

  @ViewChild('commentsSection') commentsSection!: QueryList<ElementRef>;

  post: PostResponse = {
    id: "",
    title: "",
    content: "",
    firstImage: "",
    htmlContent: "",
    excerpt: "",
    username: "",
    createdAt: "",
    medias: [],
    tags: [],
    liked: false,
    likesCount: 0,
    commentCount: 0,
  };
    loading: boolean = true;

  constructor(
    private postService: PostService,
    private preview: PreviewService,
    private route: ActivatedRoute,
    private replaceImage: UploadImage,
    private likeService: likesServiceLogique,
    private cdr: ChangeDetectorRef
  ) { }
  ngOnInit() {
    combineLatest([
      this.route.params,
      this.route.queryParams
    ])
      .pipe(
        switchMap(([params]) => this.postService.getpostByID(params['id']))
      )
      .subscribe({
        next: (response) => {
           
          this.handlePost(response.data);
        },
        error: (err) => {
          console.error("Failed to load post:", err);
          this.loading = false;
        }
      });
  }

  handlePost(data: PostResponse) {
    Object.assign(this.post, data);

    let cleanedContent = this.replaceImage.replaceImage(this.post.htmlContent ?? "", this.post);

    // Force images & videos to be responsive
    cleanedContent = cleanedContent.replace(
      /<img(.*?)>/g,
      `<img $1 style="max-width:100%;height:auto;display:block;margin:1rem 0;border-radius:10px;">`
    );

    cleanedContent = cleanedContent.replace(
      /<video(.*?)>/g,
      `<video $1 style="max-width:100%;height:auto;display:block;margin:1rem 0;border-radius:10px;" controls>`
    );

    this.post.htmlContent = this.preview.renderMarkdownWithMedia(cleanedContent);

    this.loading = false;
    this.cdr.detectChanges();
  }

  scrollToComments() {
    const section = document.getElementById('commentsSection');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  toggleLikePost(postId: string, post: PostResponse) {
    this.likeService.toggleLikePost(postId, post);
    this.cdr.detectChanges();
  }

  back() {
    window.history.back();
  }
}

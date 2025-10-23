import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Materaile } from '../../../modules/materaile-module';
import { apiUrl } from '../../../core/constant/constante';
import { PopUp } from '../../pop-up/pop-up';
import { PostResponse } from '../../../core/models/post/postResponse';
import { SharedServicePost } from '../../../core/service/serivecLogique/shared-service/shared-service-post';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/service/servicesAPIREST/auth/auth-service';
import { likesServiceLogique } from '../../../core/service/serivecLogique/like/likes-service-logique';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago-pipe';

@Component({
  selector: 'app-post-card',
  imports: [Materaile, PopUp,TimeAgoPipe],
  templateUrl: './post-card.html',
  styleUrl: './post-card.scss'
})
export class PostCard {
  constructor(private auth: AuthService, private route: ActivatedRoute, private sharedService: SharedServicePost, private router: Router
    , private like: likesServiceLogique
  ) { }
  apiUrl = apiUrl
  // isLiked: likeResponse = {
  //   isLiked: false,
  //   countLike: 0,
  // };
  @ViewChild('commentsSection') commentsSection!: ElementRef;

  @Input() post: PostResponse = {
    id: "",
    title: "",
    content: "",
    firstImage: "",
    htmlContent: "",
    excerpt: "",
    username:"",
    createdAt: "",
    medias: [],
    tags: [],
    liked: false,
    likesCount: 0,
    commentCount: 0,
  };
  @Output() editPost = new EventEmitter<any>();
  show = false;
  isPostOwner(post: any): boolean {
    const check = post.uuid_user === this.auth.getCurrentUserUUID();
    return check
  }

  get isOwner(): boolean {
    return this.isPostOwner(this.post);
  }
  popUp() {
    this.isPostOwner(this.post);
    this.show = !this.show;
    this.editPost.emit({ post: this.post });
  }
  ngOnInit() {
    this.sharedService.setCurrentPostId(this.post.id)
    localStorage.setItem("post-id", this.post.id)
  }
  onEditPost(post: any) {
    this.sharedService.editPost(post);
    this.router.navigate(['/edit'], { queryParams: { edit: true } });
  }

  toggleLikePost(postId: string, post: PostResponse) {
    this.like.toggleLikePost(postId, post);
  }




}

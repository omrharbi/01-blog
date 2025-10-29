import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Materaile } from '../../../modules/materaile-module';
import { apiUrl } from '../../../core/constant/constante';
import { PopUp } from '../../pop-up/pop-up';
import { PostResponse } from '../../../core/models/post/postResponse';
import { SharedService } from '../../../core/service/serivecLogique/shared-service/shared-service-post';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/service/servicesAPIREST/auth/auth-service';
import { likesServiceLogique } from '../../../core/service/serivecLogique/like/likes-service-logique';
import { TimeAgoPipe } from '../../../shared/pipes/time-ago-pipe';
import { Global } from '../../../core/service/serivecLogique/globalEvent/global';
import { PostService } from '../../../core/service/servicesAPIREST/posts/post-service';
import { Login } from '../../auth/login/login';
import { flatMap } from 'rxjs';
import { SharedServicePopUp } from '../../../core/service/serivecLogique/SharedServicePopUp/shared-service-popup';

@Component({
  selector: 'app-post-card',
  imports: [Materaile, PopUp, TimeAgoPipe],
  templateUrl: './post-card.html',
  styleUrl: './post-card.scss'
})
export class PostCard {
  constructor(private auth: AuthService, private route: ActivatedRoute,
    private sharedService: SharedService, private router: Router
    , private like: likesServiceLogique,
    private global: Global,
    private postService: PostService,
    private servicePopUp: SharedServicePopUp,
  ) { }
  apiUrl = apiUrl

  @ViewChild('commentsSection') commentsSection!: ElementRef;

  @Input() post: PostResponse = {
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
  @Output() editPost = new EventEmitter<any>();
  show = false;

  ngOnInit() {
    // this.show=false
    this.global.sharedData.subscribe((event) => {
      if (event.type === 'post') {
        this.onEditPost(event.data);
      }

      if (event.type === 'Deletepost') {
        // console.log("delete ");
        this.postService.DeletePost(event.data.id).subscribe({
          next: response => {
            console.log(response,"delete post ");
            
            // this.sharedService.removePost(response);
          },
          error: error => {
            console.log(error);

          }
        })
      }
    })
    this.servicePopUp.popService$.subscribe(postId => {
      this.show = postId === this.post.id;
    })

    this.sharedService.setCurrentPostId(this.post.id)
    localStorage.setItem("post-id", this.post.id)
  }
  isPostOwner(post: any): boolean {
    const check = post.uuid_user === this.auth.getCurrentUserUUID();
    return check
  }

  get isOwner(): boolean {
    return this.isPostOwner(this.post);
  }
  OnPopUp(isInside: boolean) {
    console.log("here", isInside);

    if (isInside) {
      this.isPostOwner(this.post);
      this.servicePopUp.onPopUp(this.post.id)
      this.editPost.emit({ post: this.post });
    } else {
      this.servicePopUp.closeAllPopups();
    }
  }


  onEditPost(post: any) {
    this.sharedService.editPost(post);
    this.router.navigate(['/edit'], { queryParams: { edit: true } });
  }

  toggleLikePost(postId: string, post: PostResponse) {
    this.like.toggleLikePost(postId, post);
  }



}

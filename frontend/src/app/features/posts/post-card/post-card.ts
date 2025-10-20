import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Materaile } from '../../../modules/materaile-module';
import { apiUrl } from '../../../core/constant/constante';
import { PopUp } from '../../pop-up/pop-up';
import { PostResponse } from '../../../core/models/post/postResponse';
import { SharedServicePost } from '../../../core/service/serivecLogique/shared-service/shared-service-post';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/service/servicesAPIREST/auth/auth-service';
import { LikesService } from '../../../core/service/servicesAPIREST/like/likes-service';
import { likeResponse } from '../../../core/models/like/likeResponse';

@Component({
  selector: 'app-post-card',
  imports: [Materaile, PopUp],
  templateUrl: './post-card.html',
  styleUrl: './post-card.scss'
})
export class PostCard {
  constructor(private auth: AuthService, private sharedService: SharedServicePost, private router: Router

    , private like: LikesService
  ) { }
  apiUrl = apiUrl
  isLiked: likeResponse = {
    isLiked: false
  };
  @Input() post: PostResponse = {
    id: 0,
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

  onEditPost(post: any) {
    this.sharedService.editPost(post);
    this.router.navigate(['/edit'], { queryParams: { edit: true } });
  }

  // استخدام Map مع String كمفتاح
  tempLikes = new Map<string, { liked: boolean, likesCount: number }>();

  toggleLikePost(postId: string) {
    const originalLiked = this.post.liked;
    const originalLikesCount = this.post.likesCount || 0;

    // حساب الحالة الجديدة - استخدام get مع Map
    const currentLiked = this.post.liked || this.tempLikes.get(postId)?.liked || false;
    const newLiked = !currentLiked;
    const newLikesCount = newLiked ? originalLikesCount + 1 : Math.max(0, originalLikesCount - 1);

    // حفظ التغيير المؤقت - استخدام set مع Map
    this.tempLikes.set(postId, {
      liked: newLiked,  // تصحيح: كان isLiked يجب أن يكون liked
      likesCount: newLikesCount
    });

    this.like.toggleLikePost(postId).subscribe({
      next: response => {
        this.isLiked.isLiked = response.status;

        // تحديث الـ post مع البيانات الجديدة من الخادم
        this.post.liked = response.data.isLiked;

        // إذا كان الرد يحتوي على likesCount، قم بتحديثه
        if (response.likesCount !== undefined) {
          this.post.likesCount = response.likesCount;
        }

        // مسح التغيير المؤقت بعد التحديث الناجح
        this.tempLikes.delete(postId);
      },
      error: error => {
        console.log(error);
        // التراجع عن التغيير المؤقت في حالة الخطأ
        this.tempLikes.delete(postId);
      }
    });
  }

  // دالة للحصول على الحالة الحالية
  getCurrentLikeStatus(): { liked: boolean, likesCount: number } {
    const tempLike = this.tempLikes.get(this.post.id);

    if (tempLike) {
      return tempLike;
    } else {
      return {
        liked: this.post.liked,
        likesCount: this.post.likesCount || 0
      };
    }
  }
}

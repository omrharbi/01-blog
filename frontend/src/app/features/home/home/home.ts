import { Component, Input } from '@angular/core';
import { CardShare } from '../card-share/card-share';
import { Materaile } from '../../../modules/materaile-module';
import { PostCard } from '../../posts/post-card/post-card';
import { PostResponse } from '../../../core/models/post/postResponse';
import { PostService } from '../../../core/service/servicesAPIREST/posts/post-service';
import { SharedServicePost } from '../../../core/service/serivecLogique/shared-service/shared-service-post';
import { AuthService } from '../../../core/service/servicesAPIREST/auth/auth-service';
import { NotificationPopup } from '../../notifications/notifications';
import { Global } from '../../../core/service/serivecLogique/globalEvent/global';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardShare, PostCard, Materaile, NotificationPopup],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  posts: PostResponse[] = [];
  constructor(private postservice:
    PostService, private postDatashard:
      SharedServicePost, private auth: AuthService, private global: Global
  ) { }
  isAuthenticated: boolean = false;
  isNotificated = false;
  private subscription = new Subscription();
  ngOnInit() {
    this.isAuthenticated = this.auth.isLoggedIn();
    this.postDatashard.posts$.subscribe(posts => this.posts = posts);

    this.postservice.getAllPost().subscribe(res => {
      this.posts = res.data;
      this.postDatashard.setPosts(res.data);
    });
    this.postDatashard.newpost$.subscribe(post => {
      if (post) {
        this.updatePostInList(post);
      }
    });
    this.global.sharedData.subscribe((event) => {
      console.log(event);

      if (event.type === "notification") {
        this.isNotificated = event.data;
      }

    })
    this.subscription = this.global.sharedData.subscribe((event) => {
      console.log(event);
      if (event.type === "notification") {
        this.isNotificated = event.data;
      }
    });
  }
  closeNotification(): void {
    console.log("Closing notification");
    this.isNotificated = false;
    // Also emit to sync with global state
    this.global.sharedData.emit({
      type: 'notification',
      data: false
    });
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  private updatePostInList(updatedPost: PostResponse) {
    this.posts.unshift(updatedPost);
    this.posts = [...this.posts]; // Trigger change detection
  }
}

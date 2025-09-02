```
01blog-backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── blog/
│   │   │           ├── BlogApplication.java
│   │   │           ├── config/
│   │   │           │   ├── SecurityConfig.java
│   │   │           │   ├── JwtConfig.java
│   │   │           │   ├── WebConfig.java
│   │   │           │   └── FileUploadConfig.java
│   │   │           ├── controller/
│   │   │           │   ├── AuthController.java
│   │   │           │   ├── UserController.java
│   │   │           │   ├── PostController.java
│   │   │           │   ├── CommentController.java
│   │   │           │   ├── LikeController.java
│   │   │           │   ├── SubscriptionController.java
│   │   │           │   ├── ReportController.java
│   │   │           │   ├── NotificationController.java
│   │   │           │   ├── AdminController.java
│   │   │           │   └── FileUploadController.java
│   │   │           ├── service/
│   │   │           │   ├── AuthService.java
│   │   │           │   ├── UserService.java
│   │   │           │   ├── PostService.java
│   │   │           │   ├── CommentService.java
│   │   │           │   ├── LikeService.java
│   │   │           │   ├── SubscriptionService.java
│   │   │           │   ├── ReportService.java
│   │   │           │   ├── NotificationService.java
│   │   │           │   ├── AdminService.java
│   │   │           │   ├── FileStorageService.java
│   │   │           │   └── EmailService.java
│   │   │           ├── repository/
│   │   │           │   ├── UserRepository.java
│   │   │           │   ├── PostRepository.java
│   │   │           │   ├── CommentRepository.java
│   │   │           │   ├── LikeRepository.java
│   │   │           │   ├── SubscriptionRepository.java
│   │   │           │   ├── ReportRepository.java
│   │   │           │   ├── NotificationRepository.java
│   │   │           │   └── RoleRepository.java
│   │   │           ├── model/
│   │   │           │   ├── entity/
│   │   │           │   │   ├── User.java
│   │   │           │   │   ├── Post.java
│   │   │           │   │   ├── Comment.java
│   │   │           │   │   ├── Like.java
│   │   │           │   │   ├── Subscription.java
│   │   │           │   │   ├── Report.java
│   │   │           │   │   ├── Notification.java
│   │   │           │   │   ├── Role.java
│   │   │           │   │   └── Media.java
│   │   │           │   ├── dto/
│   │   │           │   │   ├── request/
│   │   │           │   │   │   ├── LoginRequest.java
│   │   │           │   │   │   ├── RegisterRequest.java
│   │   │           │   │   │   ├── PostRequest.java
│   │   │           │   │   │   ├── CommentRequest.java
│   │   │           │   │   │   └── ReportRequest.java
│   │   │           │   │   └── response/
│   │   │           │   │       ├── JwtResponse.java
│   │   │           │   │       ├── UserResponse.java
│   │   │           │   │       ├── PostResponse.java
│   │   │           │   │       ├── CommentResponse.java
│   │   │           │   │       ├── NotificationResponse.java
│   │   │           │   │       └── ApiResponse.java
│   │   │           │   └── enums/
│   │   │           │       ├── Role.java
│   │   │           │       ├── PostStatus.java
│   │   │           │       ├── MediaType.java
│   │   │           │       └── ReportReason.java
│   │   │           ├── security/
│   │   │           │   ├── JwtAuthenticationEntryPoint.java
│   │   │           │   ├── JwtAuthenticationFilter.java
│   │   │           │   ├── JwtTokenProvider.java
│   │   │           │   └── UserPrincipal.java
│   │   │           ├── exception/
│   │   │           │   ├── GlobalExceptionHandler.java
│   │   │           │   ├── ResourceNotFoundException.java
│   │   │           │   ├── BadRequestException.java
│   │   │           │   └── UnauthorizedException.java
│   │   │           └── util/
│   │   │               ├── FileUtil.java
│   │   │               ├── DateUtil.java
│   │   │               └── ValidationUtil.java
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── application-dev.properties
│   │       ├── application-prod.properties
│   │       ├── data.sql
│   │       ├── schema.sql
│   │       └── static/
│   │           └── uploads/
│   │               ├── images/
│   │               └── videos/
│   └── test/
│       └── java/
│           └── com/
│               └── blog/
│                   ├── controller/
│                   ├── service/
│                   ├── repository/
│                   └── integration/
├── uploads/
│   ├── images/
│   └── videos/
├── pom.xml
├── .gitignore
└── README.md

01blog-frontend/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts
│   │   │   │   ├── admin.guard.ts
│   │   │   │   └── guest.guard.ts
│   │   │   ├── interceptors/
│   │   │   │   ├── auth.interceptor.ts
│   │   │   │   ├── error.interceptor.ts
│   │   │   │   └── loading.interceptor.ts
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── user.service.ts
│   │   │   │   ├── post.service.ts
│   │   │   │   ├── comment.service.ts
│   │   │   │   ├── like.service.ts
│   │   │   │   ├── subscription.service.ts
│   │   │   │   ├── notification.service.ts
│   │   │   │   ├── report.service.ts
│   │   │   │   ├── admin.service.ts
│   │   │   │   ├── file-upload.service.ts
│   │   │   │   └── websocket.service.ts
│   │   │   └── models/
│   │   │       ├── user.model.ts
│   │   │       ├── post.model.ts
│   │   │       ├── comment.model.ts
│   │   │       ├── notification.model.ts
│   │   │       ├── report.model.ts
│   │   │       └── api-response.model.ts
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   │   ├── header/
│   │   │   │   │   ├── header.component.ts
│   │   │   │   │   ├── header.component.html
│   │   │   │   │   └── header.component.scss
│   │   │   │   ├── footer/
│   │   │   │   │   ├── footer.component.ts
│   │   │   │   │   ├── footer.component.html
│   │   │   │   │   └── footer.component.scss
│   │   │   │   ├── sidebar/
│   │   │   │   │   ├── sidebar.component.ts
│   │   │   │   │   ├── sidebar.component.html
│   │   │   │   │   └── sidebar.component.scss
│   │   │   │   ├── post-card/
│   │   │   │   │   ├── post-card.component.ts
│   │   │   │   │   ├── post-card.component.html
│   │   │   │   │   └── post-card.component.scss
│   │   │   │   ├── comment/
│   │   │   │   │   ├── comment.component.ts
│   │   │   │   │   ├── comment.component.html
│   │   │   │   │   └── comment.component.scss
│   │   │   │   ├── media-upload/
│   │   │   │   │   ├── media-upload.component.ts
│   │   │   │   │   ├── media-upload.component.html
│   │   │   │   │   └── media-upload.component.scss
│   │   │   │   ├── loading-spinner/
│   │   │   │   │   ├── loading-spinner.component.ts
│   │   │   │   │   ├── loading-spinner.component.html
│   │   │   │   │   └── loading-spinner.component.scss
│   │   │   │   └── confirmation-dialog/
│   │   │   │       ├── confirmation-dialog.component.ts
│   │   │   │       ├── confirmation-dialog.component.html
│   │   │   │       └── confirmation-dialog.component.scss
│   │   │   ├── pipes/
│   │   │   │   ├── time-ago.pipe.ts
│   │   │   │   ├── truncate.pipe.ts
│   │   │   │   └── safe-url.pipe.ts
│   │   │   ├── directives/
│   │   │   │   ├── auto-resize.directive.ts
│   │   │   │   └── click-outside.directive.ts
│   │   │   └── validators/
│   │   │       ├── custom-validators.ts
│   │   │       └── password-match.validator.ts
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   ├── login.component.ts
│   │   │   │   │   ├── login.component.html
│   │   │   │   │   └── login.component.scss
│   │   │   │   ├── register/
│   │   │   │   │   ├── register.component.ts
│   │   │   │   │   ├── register.component.html
│   │   │   │   │   └── register.component.scss
│   │   │   │   └── auth-routing.module.ts
│   │   │   ├── home/
│   │   │   │   ├── home.component.ts
│   │   │   │   ├── home.component.html
│   │   │   │   ├── home.component.scss
│   │   │   │   └── home-routing.module.ts
│   │   │   ├── profile/
│   │   │   │   ├── profile.component.ts
│   │   │   │   ├── profile.component.html
│   │   │   │   ├── profile.component.scss
│   │   │   │   ├── edit-profile/
│   │   │   │   │   ├── edit-profile.component.ts
│   │   │   │   │   ├── edit-profile.component.html
│   │   │   │   │   └── edit-profile.component.scss
│   │   │   │   └── profile-routing.module.ts
│   │   │   ├── posts/
│   │   │   │   ├── post-list/
│   │   │   │   │   ├── post-list.component.ts
│   │   │   │   │   ├── post-list.component.html
│   │   │   │   │   └── post-list.component.scss
│   │   │   │   ├── post-detail/
│   │   │   │   │   ├── post-detail.component.ts
│   │   │   │   │   ├── post-detail.component.html
│   │   │   │   │   └── post-detail.component.scss
│   │   │   │   ├── create-post/
│   │   │   │   │   ├── create-post.component.ts
│   │   │   │   │   ├── create-post.component.html
│   │   │   │   │   └── create-post.component.scss
│   │   │   │   ├── edit-post/
│   │   │   │   │   ├── edit-post.component.ts
│   │   │   │   │   ├── edit-post.component.html
│   │   │   │   │   └── edit-post.component.scss
│   │   │   │   └── posts-routing.module.ts
│   │   │   ├── notifications/
│   │   │   │   ├── notification-list/
│   │   │   │   │   ├── notification-list.component.ts
│   │   │   │   │   ├── notification-list.component.html
│   │   │   │   │   └── notification-list.component.scss
│   │   │   │   └── notifications-routing.module.ts
│   │   │   ├── admin/
│   │   │   │   ├── dashboard/
│   │   │   │   │   ├── admin-dashboard.component.ts
│   │   │   │   │   ├── admin-dashboard.component.html
│   │   │   │   │   └── admin-dashboard.component.scss
│   │   │   │   ├── users-management/
│   │   │   │   │   ├── users-management.component.ts
│   │   │   │   │   ├── users-management.component.html
│   │   │   │   │   └── users-management.component.scss
│   │   │   │   ├── posts-management/
│   │   │   │   │   ├── posts-management.component.ts
│   │   │   │   │   ├── posts-management.component.html
│   │   │   │   │   └── posts-management.component.scss
│   │   │   │   ├── reports-management/
│   │   │   │   │   ├── reports-management.component.ts
│   │   │   │   │   ├── reports-management.component.html
│   │   │   │   │   └── reports-management.component.scss
│   │   │   │   └── admin-routing.module.ts
│   │   │   └── reports/
│   │   │       ├── report-user/
│   │   │       │   ├── report-user.component.ts
│   │   │       │   ├── report-user.component.html
│   │   │       │   └── report-user.component.scss
│   │   │       └── reports-routing.module.ts
│   │   ├── layout/
│   │   │   ├── main-layout/
│   │   │   │   ├── main-layout.component.ts
│   │   │   │   ├── main-layout.component.html
│   │   │   │   └── main-layout.component.scss
│   │   │   ├── auth-layout/
│   │   │   │   ├── auth-layout.component.ts
│   │   │   │   ├── auth-layout.component.html
│   │   │   │   └── auth-layout.component.scss
│   │   │   └── admin-layout/
│   │   │       ├── admin-layout.component.ts
│   │   │       ├── admin-layout.component.html
│   │   │       └── admin-layout.component.scss
│   │   ├── app-routing.module.ts
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   └── app.module.ts
│   ├── assets/
│   │   ├── images/
│   │   │   ├── logo.png
│   │   │   ├── default-avatar.png
│   │   │   └── placeholder-image.png
│   │   ├── icons/
│   │   └── styles/
│   │       ├── variables.scss
│   │       ├── mixins.scss
│   │       └── themes.scss
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── index.html
│   ├── main.ts
│   ├── polyfills.ts
│   └── styles.scss
├── angular.json
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md
```


// error-page-component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/service/servicesAPIREST/auth/auth-service';
import { NotificationService } from '../../../core/service/notificationAlert/NotificationService';

interface ErrorInfo {
  code: number;
  title: string;
  message: string;
  icon: string;
  action: string;
  actionRoute: string;
}

@Component({
  selector: 'app-error-page-component',
  imports: [],
  templateUrl: './error-page-component.html',
  styleUrl: './error-page-component.scss',
})
export class ErrorPageComponent implements OnInit {
  errorInfo: ErrorInfo;
  private notificationShown = false; // Prevent duplicate notifications

  private errorMessages: { [key: number]: ErrorInfo } = {
    400: {
      code: 400,
      title: 'Bad Request',
      message: 'The request could not be understood by the server. Please check your input and try again.',
      icon: '⚠️',
      action: 'Go Back',
      actionRoute: '/'
    },
    401: {
      code: 401,
      title: 'Unauthorized',
      message: 'Your session has expired. Please log in again to continue.',
      icon: '🔒',
      action: 'Login',
      actionRoute: '/login'
    },
    403: {
      code: 403,
      title: 'Forbidden',
      message: 'You don\'t have permission to access this resource. Please contact your administrator if you believe this is an error.',
      icon: '🚫',
      action: 'Go Home',
      actionRoute: '/'
    },
    404: {
      code: 404,
      title: 'Page Not Found',
      message: 'The page you\'re looking for doesn\'t exist or has been moved. Please check the URL or navigate back to safety.',
      icon: '🔍',
      action: 'Go Home',
      actionRoute: '/'
    },
    500: {
      code: 500,
      title: 'Internal Server Error',
      message: 'Something went wrong on our end. Our team has been notified and is working to fix the issue. Please try again later.',
      icon: '⚙️',
      action: 'Retry',
      actionRoute: '/'
    },
    503: {
      code: 503,
      title: 'Service Unavailable',
      message: 'The service is temporarily unavailable. We\'re working to restore it as quickly as possible.',
      icon: '🔧',
      action: 'Go Home',
      actionRoute: '/'
    }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private notificationAlert: NotificationService
  ) {
    this.errorInfo = this.errorMessages[404]; // Default
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const statusCode = parseInt(params['status']) || 404;
      this.errorInfo = this.errorMessages[statusCode] || this.errorMessages[404];

      // Only show notification once
      if (!this.notificationShown) {
        // this.handleErrorStatus(statusCode);
        this.notificationShown = true;
      }
    });
  }

  private handleErrorStatus(status: number): void {
    // Show notification ONLY when error page loads
    switch (status) {
      case 401:
        this.notificationAlert.showError('Your session has expired. Please log in again.', true);
        break;

      case 403:
        this.notificationAlert.showError('Access forbidden. You don\'t have permission.', false);
        break;

      case 404:
        const isLoggedIn = this.authService.isLoggedIn();
        if (!isLoggedIn) {
          this.notificationAlert.showError('Page not found. Please check the URL.', false);
        }
        break;

      case 400:
        this.notificationAlert.showError('Bad request. Please check your input.', false);
        break;

      case 500:
        this.notificationAlert.showError('Internal server error. Please try again later.', false);
        break;

      case 503:
        this.notificationAlert.showError('Service unavailable. Please try again later.', false);
        break;
    }
  }

  handleAction(): void {
    // Clear notification flag when navigating away
    this.notificationShown = false;

    if (this.errorInfo.code === 401) {
      // Already logged out in interceptor, just navigate
      this.router.navigate([this.errorInfo.actionRoute]);
    } else if (this.errorInfo.code === 500) {
      // For 500 errors, reload the page
      window.location.href = this.errorInfo.actionRoute;
    } else {
      this.router.navigate([this.errorInfo.actionRoute]);
    }
  }

  goBack(): void {
    this.notificationShown = false;
    window.history.back();
  }
}
import { ErrorHandler, inject } from '@angular/core';
import { Router } from '@angular/router';

export class GlobalErrorHandler implements ErrorHandler {
  private router = inject(Router);

  handleError(error: any): void {
    if (error?.message?.includes('Cannot match any routes') || 
        error?.message?.includes('NG04002')) {

      setTimeout(() => {
        this.router.navigate(['/home'], { replaceUrl: true });
      }, 0);
      
      return;
    }
  }
}
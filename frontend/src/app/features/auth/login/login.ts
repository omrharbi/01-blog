import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Materaile } from '../../../modules/materaile-module';
import { Router } from '@angular/router';
import { ThemeService } from '../../../modules/services/theme-service';
import { AuthService } from '../../../core/service/auth-service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [Materaile],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  loginForm: FormGroup;
  hidePassword = true;
  errorMessage: Array<string> = [];
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  router = inject(Router);
  constructor(private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      identifier: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          if (response.status) {
            this.router.navigate(['/home']); // ✅ navigate to home
          } else {
            this.errorMessage.push(response.error || 'Login failed');
          }

          // this.router.navigate(['/home'])
        },
        error: (err) => {
          console.log(err, 'err');
        },
      });
    }
  }

  continueWithGoogle(): void {
    console.log('Continue with Google');
    // Implement Google OAuth logic
  }

  continueWithGitHub(): void {
    console.log('Continue with GitHub');
    // Implement GitHub OAuth logic
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  navigateToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }
}

import { Component } from '@angular/core';
import { Materaile } from '../../../modules/materaile-module';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ThemeService } from '../../../core/services/theme-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [Materaile, ReactiveFormsModule],

  templateUrl: './register.html',
  styleUrls: [
    '../login/login.css', // shared styles
    './register.css', // page-specific styles
  ],
})
export class Register {
  loginForm: FormGroup;
  hidePassword = true;
  // constructor(public themeService:ThemeService){}
  constructor(
    public themeService: ThemeService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      // Add your login logic here
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

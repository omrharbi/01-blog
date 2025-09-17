import { Component } from '@angular/core';
import {  FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Materaile } from '../../../modules/materaile-module';
import { Router } from '@angular/router';
import { ThemeService } from '../../../core/services/theme-service';
// import { AuthenticationService } from './authentication.service';
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
  errorMessage :Array<string>=[];
   constructor(public themeService:ThemeService,private formBuilder: FormBuilder, private router: Router 
    // ,private autheService :AuthenticationService
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

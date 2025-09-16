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
  selectedFileName: string | null = null;
  currentStep = 1;

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
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
    }
  }

  continueWithGitHub(): void {
    console.log('Continue with GitHub');
    // Implement GitHub OAuth logic
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }

  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }
  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
}

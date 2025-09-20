import { Component, inject } from '@angular/core';
import { Materaile } from '../../../modules/materaile-module';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ThemeService } from '../../../modules/services/theme-service';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/service/auth-service';

@Component({
  selector: 'app-register',
  imports: [Materaile],

  templateUrl: './register.html',
  styleUrls: [
    '../login/login.css', // shared styles
    './register.css', // page-specific styles
  ],
})
export class Register {
  registerForm: FormGroup;
  hidePassword = true;
  selectedFileName: string | null = null;
  currentStep = 1;
  authentication = inject(AuthService);
  errorMessage: Array<string> = [];
  constructor(
    public themeService: ThemeService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),

      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirmpassword: new FormControl('', [Validators.required]),
    });
  }
  isStepsValid(step: number): boolean {
    console.log('Form Initialized' + step);
    if (step === 1) {
      return (
        (this.registerForm.get('firstname')?.valid ?? false) &&
        (this.registerForm.get('lastname')?.valid ?? false) &&
        (this.registerForm.get('email')?.valid ?? false)
      );
    }

    if (step === 2) {
      return (
        (this.registerForm.get('username')?.valid ?? false) &&
        (this.registerForm.get('password')?.valid ?? false) &&
        (this.registerForm.get('confirmpassword')?.valid ?? false)
      );
    }
    return false;
  }

  onSubmit() {
    console.log('clickd');
    if (this.registerForm.valid) {
      this.authentication.registrter(this.registerForm.value).subscribe({
        next: (response) => {
          if (response.status) {
            this.navigateToHome()
          } else {
            this.errorMessage.push(response.error || 'Login failed');
          }
        },
        error: (Err) => {
          console.log(Err, 'error in side register ');
        },
      }); 
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
    this.router.navigate(['/home']);
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

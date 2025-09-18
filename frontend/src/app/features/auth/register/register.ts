import { Component } from '@angular/core';
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
   
  constructor(
    public themeService: ThemeService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      firstname: new FormControl('', [Validators.required]),
      lastname: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),

      date_of_birth: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      about: new FormControl('', [Validators.required]),

      avatar: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      confirmpassword: new FormControl('', [Validators.required]),
    });
  }
  isStepsValid(step: number): boolean {
     console.log('Form Initialized'+step);
    if (step === 1) {
      return (
        (this.registerForm.get('firstname')?.valid ?? false) &&
        (this.registerForm.get('lastname')?.valid ?? false) &&
        (this.registerForm.get('email')?.valid ?? false)
      );
    }
    if (step ===2) {
      return (
        (this.registerForm.get('date_of_birth')?.valid ?? false) &&
        (this.registerForm.get('username')?.valid ?? false) &&
        (this.registerForm.get('about')?.valid ?? false)
      );
    }
    if (step === 3) {
      return (
        (this.registerForm.get('avatar')?.valid ?? false) &&
        (this.registerForm.get('password')?.valid ?? false) &&
        (this.registerForm.get('confirmpassword')?.valid ?? false) 
       );
    }
    return false;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
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

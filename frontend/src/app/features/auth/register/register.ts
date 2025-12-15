import { Component, inject } from '@angular/core';
import { Materaile } from '../../../modules/materaile-module';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { ThemeService } from '../../../modules/services/theme-service';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/service/servicesAPIREST/auth/auth-service';
import { ToastrService } from 'ngx-toastr';

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
  usernameError: string | null = null;

  // Custom validator factory to disallow '@' character in username
  private noAtSymbolValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value;
      if (value && typeof value === 'string' && value.includes('@')) {
        return { hasAtSymbol: true };
      }
      return null;
    };
  }

  // Custom validator to disallow any whitespace characters in a value
  private noSpaceValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value;
      if (value && typeof value === 'string' && /\s/.test(value)) {
        return { hasSpace: true };
      }
      return null;
    };
  }
  constructor(
    public themeService: ThemeService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toasterService: ToastrService
  ) {
    this.registerForm = this.formBuilder.group({
      firstname: new FormControl('', [Validators.required, Validators.minLength(3),
      Validators.maxLength(15), this.noSpaceValidator()]),
      lastname: new FormControl('', [Validators.required, Validators.minLength(3),
      Validators.maxLength(15), this.noSpaceValidator()]),
      email: new FormControl('', [Validators.required, Validators.email, Validators.minLength(3), Validators.maxLength(30), this.noSpaceValidator()]),
      username: new FormControl('', [Validators.required, Validators.minLength(3),
      Validators.maxLength(15), this.noAtSymbolValidator(), this.noSpaceValidator()]),
      password: new FormControl('', [Validators.required, Validators.minLength(3),
      Validators.maxLength(30)]),
      confirmpassword: new FormControl('', [Validators.required, Validators.minLength(3),
      Validators.maxLength(30)]),
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
    // Clear previous error
    this.errorMessage = [];
    // Check username custom validation explicitly to prepare custom message
    const usernameControl = this.registerForm.get('username');
    if (usernameControl?.errors && usernameControl.errors['hasAtSymbol']) {
      this.usernameError = "Username must not contain the '@' character.";
      return;
    } else {
      this.usernameError = null;
    }

    // Check for spaces in critical fields and prepare messages
    const firstnameControl = this.registerForm.get('firstname');
    const lastnameControl = this.registerForm.get('lastname');
    const emailControl = this.registerForm.get('email');

    if (firstnameControl?.errors && firstnameControl.errors['hasSpace']) {
      this.errorMessage.push('First name must not contain spaces.');
    }
    if (lastnameControl?.errors && lastnameControl.errors['hasSpace']) {
      this.errorMessage.push('Last name must not contain spaces.');
    }
    if (usernameControl?.errors && usernameControl.errors['hasSpace']) {
      this.errorMessage.push('Username must not contain spaces.');
    }
    if (emailControl?.errors && emailControl.errors['hasSpace']) {
      this.errorMessage.push('Email must not contain spaces.');
    }

    // If we collected any space-related errors, don't submit
    if (this.errorMessage.length > 0) {
      return;
    }

    if (this.registerForm.valid) {
      this.authentication.registrter(this.registerForm.value).subscribe({
        next: (response) => {
          if (response.status) {
            console.log(response, 'response from register');

            // this.navigateToHome()
          } else {
            this.errorMessage.push(response.error || 'Login failed');
          }
        },
        error: (error) => {
          const message = error?.error.error || 'Registration failed. Please try again.';
          this.toasterService.error(message);
          console.log(error, 'error in side register ');
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

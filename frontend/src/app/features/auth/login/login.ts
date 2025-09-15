import { Component } from '@angular/core'; 
import {ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms'; 
import { Materaile } from '../../../modules/materaile-module';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    Materaile ,
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  loginForm: FormGroup;

  constructor() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      // Add your login logic here
    }
  }
}

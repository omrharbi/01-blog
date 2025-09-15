import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet,MatCardModule],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss'
})
export class AuthLayout {

}

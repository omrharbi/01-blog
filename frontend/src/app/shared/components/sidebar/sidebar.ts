import { Component } from '@angular/core';
import { Materaile } from '../../../modules/materaile-module';
import { AuthService } from '../../../core/service/servicesAPIREST/auth/auth-service';

@Component({
  selector: 'app-sidebar',
  imports: [Materaile],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
 
}

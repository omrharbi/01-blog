import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterOutlet } from '@angular/router';
import { HeaderAdmin } from '../../features/admin/header-admin/header-admin';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet,MatCardModule,HeaderAdmin],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss'
})
export class AdminLayout {

}

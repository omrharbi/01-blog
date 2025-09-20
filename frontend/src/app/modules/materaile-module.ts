import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list'; // for mat-grid-list / mat-grid-tile
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
 const materaile = [
  CommonModule,
  RouterModule,
  MatCardModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatDividerModule,
  MatGridListModule,
  FormsModule,ReactiveFormsModule];

@NgModule({
  imports: [materaile],
  exports:[materaile]
})
export class Materaile {}

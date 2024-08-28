import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { AdminPoolsRoutingModule } from './admin-pools-routing.module';
import { AdminPoolsComponent } from './admin-pools.component';
import { AddPoolComponent } from './crud-operations/add-pool.component';
import { RemovePoolComponent } from './crud-operations/remove-pool.component';

@NgModule({
  declarations: [
    AdminPoolsComponent,
    AddPoolComponent,
    RemovePoolComponent,
  ],
  imports: [
    MatButtonToggleModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    CommonModule,
    AdminPoolsRoutingModule,
    NgMultiSelectDropDownModule,
  ]
})
export class AdminPoolsModule { }

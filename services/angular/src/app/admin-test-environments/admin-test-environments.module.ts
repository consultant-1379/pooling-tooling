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

import { AdminTestEnvironmentsRoutingModule } from './admin-test-environments-routing.module';
import { AdminTestEnvironmentComponent } from './admin-test-environment.component';
import { AddTestEnvironmentComponent } from './crud-operations/add-test-environment.component';
import { RemoveTestEnvironmentComponent } from './crud-operations/remove-test-environment.component';
import { EditTestEnvironmentComponent } from './crud-operations/edit-test-environment.component';


@NgModule({
  declarations: [
    AdminTestEnvironmentComponent,
    AddTestEnvironmentComponent,
    EditTestEnvironmentComponent,
    RemoveTestEnvironmentComponent,
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
    NgMultiSelectDropDownModule,
    CommonModule,
    AdminTestEnvironmentsRoutingModule,
  ]
})
export class AdminTestEnvironmentsModule { }

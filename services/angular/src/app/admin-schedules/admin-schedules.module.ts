import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {MatRadioModule} from '@angular/material/radio';

import { AdminSchedulesRoutingModule } from './admin-schedules-routing.module';
import { AdminScheduleComponent } from './admin-schedule.component';
import { AddScheduleComponent } from './crud-operations/add-schedule.component';
import { RemoveScheduleComponent } from './crud-operations/remove-schedule.component';
import { EditScheduleComponent } from './crud-operations/edit-schedule.component';


@NgModule({
  declarations: [
    AdminScheduleComponent,
    AddScheduleComponent,
    EditScheduleComponent,
    RemoveScheduleComponent,
  ],
  imports: [
    MatButtonToggleModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule,
    CommonModule,
    AdminSchedulesRoutingModule,
    MatRadioModule,
  ]
})
export class AdminSchedulesModule { }

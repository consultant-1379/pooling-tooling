import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewSchedulesRoutingModule } from './view-schedules-routing.module';
import { ViewSchedulesComponent } from './view-schedules.component';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DynamicSchedulePageComponent } from '../dynamic-schedule-page/dynamic-schedule-page.component';
import { DynamicScheduleViewAllModalComponent } from '../dynamic-schedule-view-all-modal/dynamic-schedule-view-all-modal.component';
import { DynamicScheduleViewAllPropertiesComponent }
  from '../dynamic-schedule-view-all-modal/dynamic-schedule-view-all-properties.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
  declarations: [
    ViewSchedulesComponent,
    DynamicScheduleViewAllModalComponent,
    DynamicSchedulePageComponent,
    DynamicScheduleViewAllPropertiesComponent,
  ],
  imports: [
    MatIconModule,
    MatTableModule,
    MatMenuModule,
    NgMultiSelectDropDownModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule,
    CommonModule,
    ViewSchedulesRoutingModule,
    DragDropModule,
  ]
})
export class ViewSchedulesModule { }

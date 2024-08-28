import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewTestEnvironmentsRoutingModule } from './view-test-environments-routing.module';
import { ViewTestEnvironmentsComponent } from './view-test-environments.component';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TestEnvironmentCommentsComponent } from './test-environment-comments/test-environment-comments.component';
import { TestEnvironmentActionsComponent } from './test-environment-actions/test-environment-actions.component';
import { DynamicPageComponent } from '../dynamic-page/dynamic-page.component';
import { DynamicModalComponent } from '../dynamic-modal/dynamic-modal.component';
import { DynamicTestEnvironmentPropertiesComponent } from '../dynamic-modal/dynamic-test-environment-properties.component';
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
    ViewTestEnvironmentsComponent,
    TestEnvironmentCommentsComponent,
    TestEnvironmentActionsComponent,
    DynamicPageComponent,
    DynamicModalComponent,
    DynamicTestEnvironmentPropertiesComponent,
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
    ViewTestEnvironmentsRoutingModule,
    DragDropModule,
  ]
})
export class ViewTestEnvironmentsModule { }

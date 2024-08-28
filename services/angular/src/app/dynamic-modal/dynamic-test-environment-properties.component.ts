import { Component, Input } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

import { DynamicModalComponent } from './dynamic-modal.component';

@Component({
  selector: 'app-dynamic-test-environment-properties',
  template: `
  <a href="#" id="propertiesData">
    <span (mousedown)="openTestEnvironmentPropertiesModal();">
      view
    </span>
  </a>`,
  styleUrls: ['./dynamic-modal.component.css'],
})

export class DynamicTestEnvironmentPropertiesComponent {
  @Input() data: any;
  @Input() modalDisplayedColumnIds: any[] = [];
  @Input() modalDisplayedColumnNames: any[] = [];
  @Input() testEnvironmentName = '';

  constructor(public dialog: MatDialog) {
  }
  openTestEnvironmentPropertiesModal(): void {
    this.dialog.open(DynamicModalComponent, {
      panelClass: 'custom-modal-class',
      width: '90vw',
      height: 'auto',
      data: {
        testEnvironmentPropertyData: this.data,
        displayedColumnIds: this.modalDisplayedColumnIds,
        displayedColumnNames: this.modalDisplayedColumnNames,
        title: `Test Environment Properties [${this.testEnvironmentName}]`,
      },
    });
  }
}

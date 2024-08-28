import { Component, Input } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';

import { DynamicScheduleViewAllModalComponent } from './dynamic-schedule-view-all-modal.component';

@Component({
  selector: 'app-dynamic-schedule-view-all-properties',
  template: `
  <a href="#" id="propertiesData">
    <span (mousedown)="openScheduleViewAllPropertiesModal();">
      view
    </span>
  </a>`,
  styleUrls: ['./dynamic-schedule-view-all-modal.component.css'],
})

export class DynamicScheduleViewAllPropertiesComponent {
  @Input() data: any;
  @Input() scheduleName = '';

  constructor(public dialog: MatDialog) {
  }
  openScheduleViewAllPropertiesModal(): void {
    this.dialog.open(DynamicScheduleViewAllModalComponent, {
      panelClass: 'custom-modal-class',
      width: '90vw',
      height: 'auto',
      data: {
        schedulePropertyData: this.data,
        title: `Schedule Properties [${this.scheduleName}]`,
      },
    });
  }
}


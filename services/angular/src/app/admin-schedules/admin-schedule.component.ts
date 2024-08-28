
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '../alert/alert.component';
import { ScheduleService } from '../services/schedule.service';
import { AddScheduleComponent } from './crud-operations/add-schedule.component';
import { RemoveScheduleComponent } from './crud-operations/remove-schedule.component';
import { EditScheduleComponent } from './crud-operations/edit-schedule.component';

@Component({
  selector: 'app-admin-schedule',
  styleUrls: ['./admin-schedule.component.css'],
  templateUrl: './admin-schedule.component.html',
})

export class AdminScheduleComponent implements OnInit {
  givenSchedule = '';
  enterScheduleForm!: FormGroup;
  scheduleNameControl!: AbstractControl;

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private scheduleService: ScheduleService,
  ) { }

  public ngOnInit(): void {
    this.enterScheduleForm = this.formBuilder.group({
      scheduleNameControl: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9-_]+$'),
      ])),
    });
    this.scheduleNameControl = this.enterScheduleForm.get('scheduleNameControl') as FormGroup;
  }

  public async addSchedule(): Promise<void> {
    const scheduleExists = await this.scheduleService.checkIfScheduleExists(this.givenSchedule);
    if (!scheduleExists) {
      this.dialog.open(AddScheduleComponent, {
        width: '540px',
        data: {
          scheduleName: this.givenSchedule,
        },
      });
    } else {
      this.dialog.open(AlertComponent, {
        data: {
          message: `Schedule ${this.givenSchedule} already exists in RPT`,
        },
      });
    }
    this.givenSchedule = '';
  }

  public async removeSchedule(): Promise<void> {
    const scheduleExists = await this.scheduleService.checkIfScheduleExists(this.givenSchedule);
    if (scheduleExists) {
      this.dialog.open(RemoveScheduleComponent, {
        data: {
          scheduleToRemove: this.givenSchedule,
        },
      });
      this.givenSchedule = '';
    } else {
      this.dialog.open(AlertComponent, {
        data: {
          message: `Schedule ${this.givenSchedule} does not exist in RPT`,
        },
      });
    }
  }

  public async editSchedule():  Promise<void> {
    const scheduleExists = await this.scheduleService.checkIfScheduleExists(this.givenSchedule);
    if (scheduleExists) {
      this.dialog.open(EditScheduleComponent, {
        width: '540px',
        data: {
          scheduleName: this.givenSchedule,
        },
      });
      this.givenSchedule = '';
    } else {
      this.dialog.open(AlertComponent, {
        data: {
          message: `Schedule ${this.givenSchedule} does not exist in RPT`,
        },
      });
    }
  }

}

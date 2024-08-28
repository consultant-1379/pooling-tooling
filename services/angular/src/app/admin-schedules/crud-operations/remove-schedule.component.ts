import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Schedule } from 'src/app/models/schedule';
import { ScheduleService } from 'src/app/services/schedule.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-remove-schedule',
  templateUrl: './remove-schedule.component.html',
  styleUrls: ['./remove-schedule.component.css'],
})

export class RemoveScheduleComponent implements OnInit {
  public scheduleToRemove = '';
  public removeScheduleForm!: FormGroup;
  private schedule: Schedule = new Schedule();
  private errorMessage = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RemoveScheduleComponent>,
    private formBuilder: FormBuilder,
    private scheduleService: ScheduleService,
    private snackBar: MatSnackBar,
  ) { }

  public ngOnInit(): void {
    this.removeScheduleForm = this.formBuilder.group(
      {
        scheduleToRemove: new FormControl(
          '',
          [
            Validators.required,
            (scheduleToRemoveCtrl: AbstractControl): ValidationErrors | null => {
              if (scheduleToRemoveCtrl.value !== this.data.scheduleToRemove) {
                return { invalid: true };
              }
              return null;
            }
          ],
        ),
      }
    );
    this.getScheduleInfo();
  }

  public closeDialogModal(): void {
    this.dialogRef.close();
  }

  public removeSchedule(): void {
    this.scheduleService.removeSchedule(this.schedule)
      .subscribe(
        (res) => {
          this.openInfoSnackBar(`Schedule deleted: ${this.data.scheduleToRemove}`);
        },
        (error) => {
          this.errorMessage = 'Could not delete Schedule';
          this.openErrorSnackBar(this.errorMessage, error);
          if (!environment.production) {
            console.log(error);
          }
        }
      );
    this.closeDialogModal();
  }

  private getScheduleInfo(): void {
    this.scheduleService.getScheduleByName(this.data.scheduleToRemove)
      .subscribe(
        (schedules) => {
          this.schedule = schedules[0];
        },
        (error) => {
          this.errorMessage = 'An internal error has occurred and the schedule ' +
          'details could not be retrieved';
          this.openErrorSnackBar(this.errorMessage, error);
          if (!environment.production) {
            console.log(error);
          }
          this.closeDialogModal();
        }
      );
  }

  private openInfoSnackBar(message: string): void {
    this.snackBar.open(message, '', {
      duration: 5000,
      panelClass: 'custom-snackbar-class',
    });
  }

  private openErrorSnackBar(message: string, error: any): void {
    const errorMessage = error.message ? error.message : error.toString();
    this.snackBar.open(`${message}: ${errorMessage}`, 'X', {
      panelClass: 'error-snackbar-class',
    });
  }
}

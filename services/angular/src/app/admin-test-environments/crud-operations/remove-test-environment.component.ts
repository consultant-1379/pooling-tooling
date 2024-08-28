import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TestEnvironment } from 'src/app/models/testEnvironment';
import { TestEnvironmentService } from 'src/app/services/test-environment.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-remove-test-environment',
  templateUrl: './remove-test-environment.component.html',
  styleUrls: ['./remove-test-environment.component.css'],
})

export class RemoveTestEnvironmentComponent implements OnInit {
  public testEnvironmentToRemove = '';
  public removeTestEnvironmentForm!: FormGroup;
  private testEnvironment: TestEnvironment = new TestEnvironment();
  private errorMessage = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RemoveTestEnvironmentComponent>,
    private formBuilder: FormBuilder,
    private testEnvironmentService: TestEnvironmentService,
    private snackBar: MatSnackBar,
  ) { }

  public ngOnInit(): void {
    this.removeTestEnvironmentForm = this.formBuilder.group(
      {
        testEnvironmentToRemove: new FormControl(
          '',
          [
            Validators.required,
            (testEnvironmentToRemoveCtrl: AbstractControl): ValidationErrors | null => {
              if (testEnvironmentToRemoveCtrl.value !== this.data.testEnvironmentToRemove) {
                return { invalid: true };
              }
              return null;
            }
          ],
        ),
      }
    );
    this.getTestEnvironmentInfo();
  }

  public closeDialogModal(): void {
    this.dialogRef.close();
  }

  public removeTestEnvironment(): void {
    this.testEnvironmentService.removeTestEnvironment(this.testEnvironment)
      .subscribe(
        (res) => {
          this.openInfoSnackBar(`Test Environment deleted: ${this.data.testEnvironmentToRemove}`);
        },
        (error) => {
          this.errorMessage = 'Could not delete Test Environment';
          this.openErrorSnackBar(this.errorMessage, error);
          if (!environment.production) {
            console.log(error);
          }
        }
      );
    this.closeDialogModal();
  }

  private getTestEnvironmentInfo(): void {
    this.testEnvironmentService.getTestEnvironmentByName(this.data.testEnvironmentToRemove)
      .subscribe(
        (testEnvironments) => {
          this.testEnvironment = testEnvironments[0];
        },
        (error) => {
          this.errorMessage = ('An internal error has occurred and the test ' +
          'environment details could not be retrieved');
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

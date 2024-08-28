import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TestEnvironment } from '../../models/testEnvironment';
import { TestEnvironmentService } from 'src/app/services/test-environment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PoolsService } from 'src/app/services/pools.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-add-test-environment',
  templateUrl: './add-edit-test-environment.component.html',
  styleUrls: ['./add-edit-test-environment.component.css'],
})

export class AddTestEnvironmentComponent implements OnInit {
  public addEditTestEnvironmentForm!: FormGroup;
  public testEnvironment: TestEnvironment = new TestEnvironment();
  public crudAction = 'Add';
  public dropdownSettings = {};
  public availablePools: Array<string> = [];
  private errorMessage = '';

  constructor(
    public dialogRef: MatDialogRef<AddTestEnvironmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private testEnvironmentService: TestEnvironmentService,
    private poolsService: PoolsService,
    private snackBar: MatSnackBar,
    ) { }

  public ngOnInit(): void {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'name',
      textField: 'name',
      allowSearchFilter: true,
      enableCheckAll: false,
    };
    this.addEditTestEnvironmentForm = this.formBuilder.group(
      {
        pools: new FormControl('', Validators.required),
        product: new FormControl('', Validators.required),
        platformType: new FormControl('', Validators.required),
        version: new FormControl('', Validators.required),
        ccdVersion: new FormControl('', Validators.required),
      },
    );
    this.getAvailablePools();
  }

  public closeDialogModal(): void {
    this.dialogRef.close();
  }

  public async applyChanges(): Promise<void> {
    this.testEnvironment.name = this.data.testEnvironmentName;
    try {
      const postedTestEnvironment = await this.testEnvironmentService.addTestEnvironment(this.testEnvironment);
      if (!postedTestEnvironment) {
        throw new Error('Invalid Response back from create test environment request');
      }
      this.openInfoSnackBar(`Test Environment Added: ${this.data.testEnvironmentName}`);
    } catch (error) {
      this.errorMessage = `ERROR: Failed to add the Test Environment ${this.data.testEnvironmentName}`;
      this.openErrorSnackBar(this.errorMessage, error);
      if (!environment.production) {
        console.log(error);
      }
    }
    this.closeDialogModal();
  }

  private getAvailablePools(): void {
    this.poolsService.getPools().subscribe((pools) => {
      const poolNames: Array<string> = [];
      pools.forEach((pool) => {
        poolNames.push(pool.poolName);
      });
      this.availablePools = poolNames;
    }, (error) => {
      if (!environment.production) {
        console.log(error);
      }
      this.errorMessage = 'Failed to retrieve available pools';
      this.openErrorSnackBar(this.errorMessage, error);
      this.closeDialogModal();
    });
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

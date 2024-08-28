import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Schedule } from '../../models/schedule';
import { ScheduleService } from 'src/app/services/schedule.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PoolsService } from 'src/app/services/pools.service';
import { TestEnvironmentService } from 'src/app/services/test-environment.service';
import { environment } from '../../../environments/environment';
import { cronScheduleValidator  } from './cron-custom-validator.directive';
import cronstrue from 'cronstrue';

@Component({
  selector: 'app-add-schedule',
  templateUrl: './add-edit-schedule.component.html',
  styleUrls: ['./add-edit-schedule.component.css'],
})

export class AddScheduleComponent implements OnInit {
  public cronReadableValue = '';
  public cronReadableValueError: any = '';
  public addEditScheduleForm!: FormGroup;
  public schedule: Schedule = new Schedule();
  public crudAction = 'Add';
  public availablePools: Array<string> = [];
  public availablePoolIds = new Map<string, string>();
  public availableTestEnvironmentIds = new Map<string, string>();
  public availableTestEnvironments: Array<string> = [];
  public typeOfScheduleItems: string[] = ['pool', 'test-environment'];
  public scheduleTypeOptions = ['auto-refresh', 'auto-trigger'];
  public projectAreaOptions = ['PSO', 'Prod-Eng', 'Release', 'AutoApp', 'AAS'];
  public dropdownSettings = {};
  public dropdownSingleSettings = {};
  private errorMessage = '';

  constructor(
    public dialogRef: MatDialogRef<AddScheduleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private poolsService: PoolsService,
    private testEnvironmentService: TestEnvironmentService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private scheduleService: ScheduleService,
    ) { }

  public ngOnInit(): void {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'name',
      textField: 'name',
      allowSearchFilter: true,
      enableCheckAll: false,
    };
    this.dropdownSingleSettings = {
      singleSelection: true,
      idField: 'name',
      textField: 'name',
      allowSearchFilter: true,
      enableCheckAll: false,
    };
    this.addEditScheduleForm = this.formBuilder.group(
      {
        scheduleEnabled: new FormControl('', Validators.required),
        typeOfItemsToSchedule: new FormControl(''),
        itemsToScheduleIdsValue: new FormControl('', Validators.required),
        spinnakerPipelineApplicationName: new FormControl('', Validators.required),
        spinnakerPipelineName: new FormControl('', Validators.required),
        retentionPolicyEnabled: new FormControl(true, Validators.required),
        numOfStanbyEnvsToBeRetained: new FormControl(null),
        numOfEiapReleaseForComparison: new FormControl(null),
        scheduleType: new FormControl('', Validators.required),
        projectArea: new FormControl('', Validators.required),
        cronSchedule: new FormControl('',[Validators.required, cronScheduleValidator]),
      },
    );
    this.schedule.scheduleEnabled =  false;
    this.schedule.retentionPolicyData.retentionPolicyEnabled =  false;
    this.getAvailablePools();
    this.getAvailableTestEnvironments();
    this.retentionValidator();
  }

  cronHumanReadable(cronValue: any) {
    try {
      if (typeof cronValue === 'string') {
        this.cronReadableValue = cronstrue.toString(cronValue);
      } else {
        this.cronReadableValue = cronstrue.toString(cronValue.target.value);
      }
    } catch (e) {
      this.cronReadableValueError = e;
    }
  }

  clearSelection() {
    this.schedule.refreshData.itemsToScheduleIds = [];
  }

  retentionValidator(){
    const numOfStanbyEnvsToBeRetainedControl = this.addEditScheduleForm.get('numOfStanbyEnvsToBeRetained');
    const numOfEiapReleaseForComparisonControl = this.addEditScheduleForm.get('numOfEiapReleaseForComparison');
    const retentionPolicyEnabledControl = this.addEditScheduleForm.get('retentionPolicyEnabled');

    retentionPolicyEnabledControl?.valueChanges
    .subscribe(retentionPolicyEnabled => {
      if (retentionPolicyEnabled) {
        numOfStanbyEnvsToBeRetainedControl?.setValidators([
          Validators.required,
          Validators.pattern(/^[1-9][0-9]*$/),
        ]);
        numOfEiapReleaseForComparisonControl?.setValidators([
          Validators.required,
          Validators.pattern(/^[1-9][0-9]*$/),
        ]);
      } else {
        numOfStanbyEnvsToBeRetainedControl?.clearValidators();
        numOfEiapReleaseForComparisonControl?.clearValidators();
      }
      numOfStanbyEnvsToBeRetainedControl?.updateValueAndValidity();
      numOfEiapReleaseForComparisonControl?.updateValueAndValidity();
    });
  }

  public closeDialogModal(): void {
    this.dialogRef.close();
  }

  public async applyChanges(): Promise<void> {
    this.schedule.scheduleName = this.data.scheduleName;
    const selectedPools: Array<any> = [];
    const selectedTestEnvironments: Array<any> = [];
    if(this.schedule.typeOfItemsToSchedule === 'pool') {
      this.schedule.refreshData.itemsToScheduleIds.forEach((item) => {
        this.availablePoolIds.forEach((value: string, key: string) => {
          if (value === item) {
            selectedPools.push(key);
          }
        });
        this.schedule.refreshData.itemsToScheduleIds = selectedPools;
      });
    }
    if(this.schedule.typeOfItemsToSchedule === 'test-environment') {
      this.schedule.refreshData.itemsToScheduleIds.forEach((item) => {
        this.availableTestEnvironmentIds.forEach((value: string, key: string) => {
          if (value === item) {
            selectedTestEnvironments.push(key);
          }
        });
        this.schedule.refreshData.itemsToScheduleIds = selectedTestEnvironments;
      });
    }
    try {
      const postedSchedule = await this.scheduleService.addSchedule(this.schedule);
      if (!postedSchedule) {
        throw new Error('Invalid Response back from create schedule request');
      }
      this.openInfoSnackBar(`Schedule Added: ${this.data.scheduleName}`);
    } catch (error) {
      this.errorMessage = `ERROR: Failed to add the Schedule ${this.data.scheduleName}`;
      this.openErrorSnackBar(this.errorMessage, error);
      if (!environment.production) {
        console.log(error);
      }
    }
    this.closeDialogModal();
  }

  private getAvailablePools(): void {
    this.poolsService.getPools().subscribe((pools) => {
      this.availablePoolIds = new Map(pools.map((pool) => [pool.id, pool.poolName]));
      this.availablePools = Array.from(this.availablePoolIds.values());
    }, (error) => {
      this.errorMessage = 'Failed to retrieve available pools';
      this.openErrorSnackBar(this.errorMessage, error);
      if (!environment.production) {
        console.log(error);
      }
      this.closeDialogModal();
    });
  }

  private getAvailableTestEnvironments(): void {
    this.testEnvironmentService.getTestEnvironments().subscribe((testEnvironments) => {
      this.availableTestEnvironmentIds = new Map(testEnvironments.map((testEnvironment) => [testEnvironment.id, testEnvironment.name]));
      this.availableTestEnvironments = Array.from(this.availableTestEnvironmentIds.values());
    }, (error) => {
      if (!environment.production) {
        this.errorMessage = 'Failed to retrieve test environments';
        this.openErrorSnackBar(this.errorMessage, error);
        console.log(error);
      }
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

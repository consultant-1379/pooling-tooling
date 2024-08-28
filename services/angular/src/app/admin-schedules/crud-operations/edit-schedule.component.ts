import { ChangeDetectorRef, Component, Inject, OnInit, OnDestroy } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Schedule } from '../../models/schedule';
import { ScheduleService } from 'src/app/services/schedule.service';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { PoolsService } from 'src/app/services/pools.service';
import { TestEnvironmentService } from 'src/app/services/test-environment.service';
import { environment } from '../../../environments/environment';
import { cronScheduleValidator  } from './cron-custom-validator.directive';
import cronstrue from 'cronstrue';
import { SocketioService } from '../../services/socketio.service';
import { AlertComponent } from '../../alert/alert.component';
import { MatDialog } from '@angular/material/dialog';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-edit-schedule',
  templateUrl: './add-edit-schedule.component.html',
  styleUrls: ['./add-edit-schedule.component.css'],
})

export class EditScheduleComponent implements OnInit, OnDestroy{
  public addEditScheduleForm!: FormGroup;
  public schedule: Schedule = new Schedule();
  public crudAction = 'Edit';
  public availablePools: Array<string> = [];
  public availablePoolIds = new Map<string, string>();
  public availableTestEnvironments: Array<string> = [];
  public availableTestEnvironmentIds = new Map<string, string>();
  public selectedSchedulePools: Array<string> = [];
  public selectedPools= '';
  public selectedTestEnvironments= '';
  public typeOfScheduleItems: string[] = ['pool', 'test-environment'];
  public cronReadableValue = '';
  public cronReadableValueError: any = '';
  public scheduleTypeOptions = ['auto-refresh', 'auto-trigger'];
  public projectAreaOptions = ['PSO', 'Prod-Eng', 'Release', 'AutoApp', 'AAS'];
  public dropdownSettings = {};
  public dropdownSingleSettings = {};
  public ioConnection: any;
  public modalOpen = true;
  private snackBarRef?: MatSnackBarRef<any> ;
  private errorMessage = '';


  constructor(
    public dialogRef: MatDialogRef<EditScheduleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private scheduleService: ScheduleService,
    private poolsService: PoolsService,
    private testEnvironmentService: TestEnvironmentService,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private socketService: SocketioService,
    private dialog: MatDialog,
    private router: Router,
  ) { }

  public ngOnInit(): void {
    this.getData();
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
        retentionPolicyEnabled: new FormControl('', Validators.required),
        numOfStanbyEnvsToBeRetained: new FormControl(null),
        numOfEiapReleaseForComparison: new FormControl(null),
        scheduleType: new FormControl('', Validators.required),
        projectArea: new FormControl('', Validators.required),
        cronSchedule: new FormControl('',[Validators.required, cronScheduleValidator]),
      },
    );

    this.afterContentChecked();
    this.retentionValidator();
    this.retentionValidatorOnChangeUpdate();
    this.listenForEvents();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.snackBarRef) {
          this.snackBarRef.dismiss();
        }
      }
    });
  }

  public ngOnDestroy(): void {
    this.modalOpen = false;
    this.unsubscribeFromEvents();
  }

  cronHumanReadable(cronValue: any) {
    try{
      if(typeof(cronValue) === 'string'){
        this.cronReadableValue = cronstrue.toString(cronValue);
      }else{
        this.cronReadableValue = cronstrue.toString(cronValue.target.value);
      }
    }catch(e){
      this.cronReadableValueError = e ;
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
          Validators.pattern('^[1-9][0-9]*$'),
        ]);
        numOfEiapReleaseForComparisonControl?.setValidators([
          Validators.required,
          Validators.pattern('^[1-9][0-9]*$'),
        ]);
      } else {
        numOfStanbyEnvsToBeRetainedControl?.setValidators(null);
        numOfEiapReleaseForComparisonControl?.setValidators(null);
      }
    });
  }

  retentionValidatorOnChangeUpdate(){
  this.addEditScheduleForm.get('retentionPolicyEnabled')?.valueChanges
  .subscribe(value => {
    this.addEditScheduleForm.get('numOfEiapReleaseForComparison')?.updateValueAndValidity();
    this.addEditScheduleForm.get('numOfStanbyEnvsToBeRetained')?.updateValueAndValidity();
    });
  }

  public closeDialogModal(): void {
    this.dialogRef.close();
  }

  afterContentChecked(): void {
    this.cdr.detectChanges();
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
      const updatedSchedule = await this.scheduleService.patchSchedule(this.schedule);
      if (!updatedSchedule) {
        throw new Error('Invalid Response back from the schedule patch request');
      }
      this.openInfoSnackBar(`Schedule Updated: ${this.data.scheduleName}`);
    } catch (error) {
      this.errorMessage = `ERROR: Failed to edit the Schedule ${this.data.scheduleName}`;
      this.openErrorSnackBar(this.errorMessage, error);
      if (!environment.production) {
        console.log(error);
      }
    }
    this.closeDialogModal();
  }

  private async getData(): Promise<void> {
    await this.getAvailablePools();
    await this.getAvailableTestEnvironments();
    this.getScheduleInfo();
  }

  private getScheduleInfo(): void {
    this.scheduleService.getScheduleByName(this.data.scheduleName)
      .subscribe(
        (schedules) => {
          this.schedule = schedules[0];
          const selectedPools: Array<any> = [];
          const selectedTestEnvironments: Array<any> = [];
            if(this.schedule.typeOfItemsToSchedule === 'pool') {
            this.schedule.refreshData.itemsToScheduleIds.forEach((item) => {
              selectedPools.push(this.availablePoolIds.get(item));
              });
              this.schedule.refreshData.itemsToScheduleIds = selectedPools;
            }
            if(this.schedule.typeOfItemsToSchedule === 'test-environment') {
              this.schedule.refreshData.itemsToScheduleIds.forEach((item) => {
                selectedTestEnvironments.push(this.availableTestEnvironmentIds.get(item));
                });
                this.schedule.refreshData.itemsToScheduleIds = selectedTestEnvironments;
              }
            if (this.schedule.scheduleOptions.cronSchedule){
              this.cronHumanReadable(this.schedule.scheduleOptions.cronSchedule);
            }
          },
          (error) => {
            this.errorMessage= 'An internal error has occurred and the schedule ' +
            'details could not be retrieved';
            this.openErrorSnackBar(this.errorMessage, error);
            if (!environment.production) {
              console.log(error);
            }
            this.closeDialogModal();
        }
      );
    }

  private async getAvailablePools(): Promise<void> {
    return this.poolsService.getPools().toPromise().then((pools) => {
      this.availablePoolIds = new Map(pools.map((pool) => [pool.id, pool.poolName]));
      this.availablePools = Array.from(this.availablePoolIds.values());
    }, (error) => {
      if (!environment.production) {
        console.log(error);
      }
    });
  }

  private async getAvailableTestEnvironments(): Promise<void> {
    return this.testEnvironmentService.getTestEnvironments().toPromise().then((testEnvironments) => {
      this.availableTestEnvironmentIds = new Map(testEnvironments.map((testEnvironment) => [testEnvironment.id, testEnvironment.name]));
      this.availableTestEnvironments = Array.from(this.availableTestEnvironmentIds.values());
    }, (error) => {
      if (!environment.production) {
        console.log(error);
      }
    });
  }

  private listenForEvents(): void {
    this.ioConnection = this.socketService
      .onScheduleMessage()
      .subscribe((message: string) => {
        if (this.modalOpen && message.includes(`schedules table updated ${this.data.scheduleName}`)) {
          const snackBarMessage = `Properties of Schedule ${this.data.scheduleName} have been updated ` +
                                  `since modal opened! Please try editing Schedule again.`;
          this.closeDialogModal();
          this.openSocketSnackBar(snackBarMessage);
        }
      });
  }

  private unsubscribeFromEvents(): void {
    if(this.ioConnection) {
      this.ioConnection.unsubscribe();
    }
  }

  private openInfoSnackBar(message: string): void {
    this.snackBar.open(message, '', {
      duration: 5000,
      panelClass: 'custom-snackbar-class',
    });
  }

  private openSocketSnackBar(message: string): void {
    this.snackBarRef = this.snackBar.open(message, 'X', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: 'socket-snackbar-class',
    });
  }

  private openErrorSnackBar(message: string, error: any): void {
    const errorMessage = error.message ? error.message : error.toString();
    this.snackBar.open(`${message}: ${errorMessage}`, 'X', {
      panelClass: 'error-snackbar-class',
    });
  }

}

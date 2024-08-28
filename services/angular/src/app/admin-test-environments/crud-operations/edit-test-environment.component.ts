import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TestEnvironment } from '../../models/testEnvironment';
import { TestEnvironmentService } from 'src/app/services/test-environment.service';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { PoolsService } from 'src/app/services/pools.service';
import { environment } from '../../../environments/environment';
import { SocketioService } from '../../services/socketio.service';
import { AlertComponent } from '../../alert/alert.component';
import { MatDialog } from '@angular/material/dialog';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-edit-test-environment',
  templateUrl: './add-edit-test-environment.component.html',
  styleUrls: ['./add-edit-test-environment.component.css'],
})

export class EditTestEnvironmentComponent implements OnInit, OnDestroy {
  public addEditTestEnvironmentForm!: FormGroup;
  public testEnvironment: TestEnvironment = new TestEnvironment();
  public crudAction = 'Edit';
  public dropdownSettings = {};
  public availablePools: Array<string> = [];
  public ioConnection: any;
  public modalOpen = true;
  private snackBarRef?: MatSnackBarRef<any>;
  private errorMessage = '';

  constructor(
    public dialogRef: MatDialogRef<EditTestEnvironmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private testEnvironmentService: TestEnvironmentService,
    private poolsService: PoolsService,
    private snackBar: MatSnackBar,
    private socketService: SocketioService,
    private dialog: MatDialog,
    private router: Router,
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
    this.getTestEnvironmentInfo();
    this.getAvailablePools();
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

  public closeDialogModal(): void {
    this.dialogRef.close();
  }

  public async applyChanges(): Promise<void> {
    this.testEnvironment.name = this.data.testEnvironmentName;
    try {
      const updatedTestEnvironment = await this.testEnvironmentService.patchTestEnvironment(this.testEnvironment);
      if (!updatedTestEnvironment) {
        throw new Error('Invalid Response back from the test environment patch request');
      }
      this.openInfoSnackBar(`Test Environment Updated: ${this.data.testEnvironmentName}`);
    } catch (error) {
      this.errorMessage = `ERROR: Failed to edit the Test Environment ${this.data.testEnvironmentName}`;
      this.openErrorSnackBar(this.errorMessage, error);
      if (!environment.production) {
        console.log(error);
      }
    }
    this.closeDialogModal();
  }

  private getTestEnvironmentInfo(): void {
    this.testEnvironmentService.getTestEnvironmentByName(this.data.testEnvironmentName)
      .subscribe(
        (testEnvironments) => {
          this.testEnvironment = testEnvironments[0];
        },
        (error) => {
          this.errorMessage = 'An internal error has occurred and the test ' +
          'environment details could not be retrieved';
          this.openErrorSnackBar(this.errorMessage, error);
          if (!environment.production) {
            console.log(error);
          }
          this.closeDialogModal();
        }
      );
  }

  private getAvailablePools(): void {
    this.poolsService.getPools().subscribe((pools) => {
      const poolNames: Array<string> = [];
      pools.forEach((pool) => {
        poolNames.push(pool.poolName);
      });
      this.availablePools = poolNames;
    }, (error) => {
      this.errorMessage = 'Failed to retrieve available pools';
      this.openErrorSnackBar(this.errorMessage, error);
      if (!environment.production) {
        console.log(error);
      }
      this.closeDialogModal();
    });
  }

  private listenForEvents(): void {
    this.ioConnection = this.socketService
      .onTestEnvironmentMessage()
      .subscribe((message: string) => {
          if (this.modalOpen && message.includes(`test environment updated ${this.data.testEnvironmentName}`)) {
            const snackBarMessage = `Properties of Test Environment ${this.data.testEnvironmentName} have been updated ` +
                                    `since modal opened! Please try editing Test Environment again.`;
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

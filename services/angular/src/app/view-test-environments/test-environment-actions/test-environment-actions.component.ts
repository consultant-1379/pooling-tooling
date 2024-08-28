import { Component, OnInit, Input } from '@angular/core';
import { TestEnvironment } from '../../models/testEnvironment';
import { environment } from '../../../environments/environment';
import { TestEnvironmentService } from 'src/app/services/test-environment.service';
import { UiFunctionsService } from 'src/app/services/ui-functions.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-test-environment-actions',
  templateUrl: './test-environment-actions.component.html',
  styleUrls: ['./test-environment-actions.component.css'],
})
export class TestEnvironmentActionsComponent implements OnInit {
  @Input() testEnvironmentInfo!: TestEnvironment;

  private username = this.authService.getCookie('signum');

  constructor(
    private testEnvironmentService: TestEnvironmentService,
    private uiFunctionsService: UiFunctionsService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
  }

  setTestEnvironmentToReserved(testEnvironment: TestEnvironment): void {
    if (testEnvironment.status === 'Available') {
      this.updateTestEnvironmentStatus(testEnvironment, 'reserve', 'Reserved', 'availableToReserved');
    } else if (testEnvironment.status === 'Quarantine') {
      this.updateTestEnvironmentStatus(testEnvironment, 'reserve', 'Reserved', 'quarantineToReserved');
    } else if (testEnvironment.status === 'Standby') {
      this.updateTestEnvironmentStatus(testEnvironment, 'reserve', 'Reserved', 'standbyToReserved');
    }
  }

  setTestEnvironmentToAvailable(testEnvironment: TestEnvironment): void {
    if (testEnvironment.status === 'Quarantine') {
      this.updateTestEnvironmentStatus(testEnvironment, 'unreserve', 'Available', 'quarantineToAvailable');
    } else if (testEnvironment.status === 'Reserved') {
      this.updateTestEnvironmentStatus(testEnvironment, 'unreserve', 'Available', 'reservedToAvailable');
    } else if (testEnvironment.status === 'Standby') {
      this.updateTestEnvironmentStatus(testEnvironment, 'unreserve', 'Available', 'standbyToAvailable');
    }
  }

  setTestEnvironmentToQuarantine(testEnvironment: TestEnvironment): void {
    if (testEnvironment.status === 'Available') {
      this.updateTestEnvironmentStatus(testEnvironment, 'quarantine', 'Quarantine', 'availableToQuarantine');
    } else if (testEnvironment.status === 'Reserved') {
      this.updateTestEnvironmentStatus(testEnvironment, 'quarantine', 'Quarantine', 'reservedToQuarantine');
    } else if (testEnvironment.status === 'Standby') {
      this.updateTestEnvironmentStatus(testEnvironment, 'quarantine', 'Quarantine', 'standbyToQuarantine');
    }
  }

  setTestEnvironmentToStandby(testEnvironment: TestEnvironment): void {
    if (testEnvironment.status === 'Quarantine') {
      this.updateTestEnvironmentStatus(testEnvironment, 'standby', 'Standby', 'quarantineToStandby');
    } else if (testEnvironment.status === 'Reserved') {
      this.updateTestEnvironmentStatus(testEnvironment, 'standby', 'Standby', 'reservedToStandby');
    } else if (testEnvironment.status === 'Available') {
      this.updateTestEnvironmentStatus(testEnvironment, 'standby', 'Standby', 'availableToStandby');
    } else if (testEnvironment.status === 'Refreshing') {
      this.updateTestEnvironmentStatus(testEnvironment, 'standby', 'Standby', 'refreshingToStandby');
    }
  }

  setTestEnvironmentToRefreshing(testEnvironment: TestEnvironment): void {
    if(testEnvironment.status === 'Standby') {
      this.updateTestEnvironmentStatus(testEnvironment, 'refreshing', 'Refreshing', 'standbyToRefreshing');
    }
  }

  updateTestEnvironmentStatus(testEnvironment: TestEnvironment, action: string, newState: string, caseForSwitch: string): void {
    const positiveSubscribeOutput = () => {
      this.openInfoSnackBar(`Test Environment status set to ${newState} by ${this.username}`);
    };
    const negativeSubscribeOutput = (error: ErrorEvent) => {
      this.openInfoSnackBar(`Unable to ${action} test environment ${
        testEnvironment.name}. Failed with error ${error.message}`);
    };

    this.testEnvironmentService.hasTestEnvironmentChangedSincePageLoad(testEnvironment).then((hasEnvironmentChanged) => {
      if (hasEnvironmentChanged) {
        this.openInfoSnackBar(`ERROR: Unable to ${action} test environment as the test environment has been updated since you opened page.
        Please refresh browser and retry action`);
      } else {
        switch (caseForSwitch) {
          case 'quarantineToAvailable':
            this.uiFunctionsService.updateTestEnvironmentStatusFromQuarantineToAvailable(
              testEnvironment.id, this.username).subscribe(positiveSubscribeOutput, negativeSubscribeOutput);
            break;
          case 'availableToQuarantine':
          case 'quarantineToStandby':
          case 'reservedToStandby':
          case 'availableToStandby':
          case 'refreshingToStandby':
            this.testEnvironmentService.updateTestEnvironmentStatus(
              testEnvironment.id, newState, this.username).subscribe(positiveSubscribeOutput, negativeSubscribeOutput);
            break;
          case 'quarantineToReserved':
            this.uiFunctionsService.updateTestEnvironmentStatusFromQuarantineToReserved(
              testEnvironment.id, this.username).subscribe(positiveSubscribeOutput, negativeSubscribeOutput);
            break;
          case 'reservedToAvailable':
            this.uiFunctionsService.updateTestEnvironmentStatusFromReservedToAvailable(
              testEnvironment.id, this.username).subscribe(positiveSubscribeOutput, negativeSubscribeOutput);
            break;
          case 'reservedToQuarantine':
            this.uiFunctionsService.updateTestEnvironmentStatusFromReservedToQuarantine(
              testEnvironment.id, this.username).subscribe(positiveSubscribeOutput, negativeSubscribeOutput);
            break;
          case 'standbyToQuarantine':
            this.uiFunctionsService.updateTestEnvironmentStatusFromStandbyToQuarantine(
              testEnvironment.id, this.username).subscribe(positiveSubscribeOutput, negativeSubscribeOutput);
            break;
          case 'standbyToReserved':
            this.uiFunctionsService.updateTestEnvironmentStatusFromStandbyToReserved(
              testEnvironment.id, this.username).subscribe(positiveSubscribeOutput, negativeSubscribeOutput);
            break;
          case 'standbyToRefreshing':
            this.uiFunctionsService.updateTestEnvironmentStatusFromStandbyToRefreshing(
              testEnvironment.id, this.username).subscribe(positiveSubscribeOutput, negativeSubscribeOutput);
            break;
          case 'standbyToAvailable':
            this.uiFunctionsService.updateTestEnvironmentStatusFromStandbyToAvailable(
              testEnvironment.id, this.username).subscribe(positiveSubscribeOutput, negativeSubscribeOutput);
            break;
          case 'availableToReserved':
            this.uiFunctionsService.updateTestEnvironmentStatusFromAvailableToReserved(
              testEnvironment.id, this.username).subscribe(positiveSubscribeOutput, negativeSubscribeOutput);
            break;
        }
      }
    }, (error) => {
      this.openErrorSnackBar(`Unable to ${action} test environment ${
        testEnvironment.name}.`, error);
      if (!environment.production) {
        console.log(error.message);
      }
    });
  }

  openEnvironmentLogs(testEnvironmentName: string): void {
    const kibanaHostName =
      'https://data-analytics-kibana.ews.gic.ericsson.se/s/cicd/app/dashboards#/view/Resource_Pooling_Tool' +
      `?_g=(filters:!((query:(query_string:(analyze_wildcard:!t,query:\'res.0.name.keyword:${testEnvironmentName}\')))),` +
      'refreshInterval:(pause:!t,value:0),time:(from:now-30d,to:now))';
    window.open(kibanaHostName, '_blank');
  }

  private openInfoSnackBar(message: string): void {
    this.snackBar.open(message, '', {
      duration: 5000,
      panelClass: 'custom-snackbar-class'
    });
  }

  private openErrorSnackBar(message: string, error: any): void {
    const errorMessage = error.message ? error.message : error.toString();
    this.snackBar.open(`${message}: ${errorMessage}`, 'X', {
      panelClass: 'error-snackbar-class',
    });
  }

}

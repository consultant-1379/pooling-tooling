import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ScheduleService } from '../services/schedule.service';
import { PoolsService } from '../services/pools.service';
import { TestEnvironmentService } from '../services/test-environment.service';
import { MatTableDataSource } from '@angular/material/table';
import { SocketioService } from '../services/socketio.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Schedule } from '../models/schedule';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';
import cronstrue from 'cronstrue';

@Component({
  selector: 'app-dynamic-schedule-page',
  templateUrl: './dynamic-schedule-page.component.html',
  styleUrls: ['./dynamic-schedule-page.component.css'],
})
export class DynamicSchedulePageComponent implements OnInit {

  @Input() tableDisplayedColumnNames: any[] = [];
  @Input() tableDisplayedColumnsIds: any[] = [];
  @Input() tableTitle = '';
  @Input() modalDisplayedColumnIds: any[] = [];
  @Input() modalDisplayedColumnNames: any[] = [];
  @Input() modalTitle = '';
  @Input() readableCronSchedule = '';
  @Input() isVisible = true;
  public availablePools: Array<string> = [];
  public availablePoolIds = new Map<string, string>();
  public availableTestEnvironments: Array<string> = [];
  public availableTestEnvironmentIds = new Map<string, string>();
  public dynamicDataSource!: MatTableDataSource<Schedule>;
  public errorMessage = '';
  public ioConnection: any;


  private schedulesSubscription!: Subscription;

  constructor(
    private poolsService: PoolsService,
    private testEnvironmentService: TestEnvironmentService,
    private scheduleService: ScheduleService,
    private route: ActivatedRoute,
  ) {
    this.route.params.subscribe(() => {
        this.getSchedules();
      });
  }

  ngOnInit(): void {
    this.getData();
  }

  cronHumanReadable(cronValue: any) {
    return cronstrue.toString(cronValue);
  }

  private async getData(): Promise<void> {
    await this.getAvailablePools();
    await this.getAvailableTestEnvironments();
    this.getSchedules();
  }

  private getSchedules(): void {
    this.getAvailablePools();
    this.getAvailableTestEnvironments();
    this.schedulesSubscription = this.scheduleService
      .getSchedules()
      .subscribe(
        (schedulesData) => {
          this.dynamicDataSource = new MatTableDataSource(schedulesData);
          this.dynamicDataSource.data.forEach((value) => {
            if (value.scheduleOptions.cronSchedule) {
              this.readableCronSchedule = cronstrue.toString(value.scheduleOptions.cronSchedule);
            }
              if(value.typeOfItemsToSchedule === 'pool') {
                value.refreshData.itemsToScheduleIds =
                  value.refreshData.itemsToScheduleIds.map(item => this.availablePoolIds.get(item) || `Invalid Pool id`);
            }
            if(value.typeOfItemsToSchedule === 'test-environment') {
              value.refreshData.itemsToScheduleIds =
                value.refreshData.itemsToScheduleIds.map(item => this.availableTestEnvironmentIds.get(item) || `Invalid Test Environment`);
              }
        });
        },
        (error: ErrorEvent) => {
          this.errorMessage = error.error.message;
        }
      );
  }

  private async getAvailablePools(): Promise<void> {
    return this.poolsService.getPools().toPromise().then((pools) => {
      this.availablePoolIds = new Map(pools.map((pool) => [pool.id, pool.poolName]));
    }, (error) => {
      if (!environment.production) {
        console.log(error);
      }
    });
  }

  private async getAvailableTestEnvironments(): Promise<void> {
    return this.testEnvironmentService.getTestEnvironments().toPromise().then((testEnvironments) => {
      this.availableTestEnvironmentIds = new Map(testEnvironments.map((testEnvironment) => [testEnvironment.id, testEnvironment.name]));
    }, (error) => {
      if (!environment.production) {
        console.log(error);
      }
    });
  }
}

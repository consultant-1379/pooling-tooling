import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { TestEnvironmentService } from '../services/test-environment.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SocketioService } from '../services/socketio.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TestEnvironment } from '../models/testEnvironment';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dynamic-page',
  templateUrl: './dynamic-page.component.html',
  styleUrls: ['./dynamic-page.component.css'],
})
export class DynamicPageComponent implements OnInit {

  @Input() tableDisplayedColumnNames: any[] = [];
  @Input() tableDisplayedColumnsIds: any[] = [];
  @Input() tableTitle = '';
  @Input() modalDisplayedColumnIds: any[] = [];
  @Input() modalDisplayedColumnNames: any[] = [];
  @Input() modalTitle = '';
  @Input() poolName = '';

  @Input() isVisible = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public dynamicDataSource!: MatTableDataSource<TestEnvironment>;
  public errorMessage = '';
  public ioConnection: any;
  public dragDisabled = false;

  private testEnvironmentsSubscription!: Subscription;

  constructor(
    private testEnvironmentService: TestEnvironmentService,
    private socketService: SocketioService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.route.params.subscribe((poolParam) => {
      if (Object.keys(poolParam).length !== 0) {
        this.poolName = poolParam.poolName;
        this.getTestEnvironmentsByPool(this.poolName);
      } else {
        this.poolName = 'testEnvironmentViewIndex';
        this.getTestEnvironments();
      }
    });
  }

  ngOnInit(): void {
    this.listenForEvents();
  }

  onCdkDrop(event: CdkDragDrop<TestEnvironment[]>) {
    moveItemInArray(this.dynamicDataSource.data, event.previousIndex, event.currentIndex);
    // eslint-disable-next-line no-underscore-dangle
    this.dynamicDataSource._updateChangeSubscription();

    this.dynamicDataSource.data.forEach((value, index) => {
      if (value.priorityInfo) {
        value.priorityInfo.viewIndices[this.poolName] = index;
      }
    });

    this.dynamicDataSource.data.forEach((value) => {
      this.testEnvironmentService.updateTestEnvironmentPriorityInfo(value.id, value.priorityInfo)
      .catch(error => {
        this.errorMessage = 'Failed to update ordering of table elements';
        this.openErrorSnackBar(this.errorMessage, error);
      });
    });
  }

  private getTestEnvironmentsByPool(pool: string): void {
    this.testEnvironmentsSubscription = this.testEnvironmentService
      .getTestEnvironmentsByPool(pool)
      .subscribe(
        (testEnvironmentsData) => {
          this.dynamicDataSource = new MatTableDataSource(testEnvironmentsData);
          this.dynamicDataSource.paginator = this.paginator;
          this.dynamicDataSource.sort = this.sort;
        },
        (error: ErrorEvent) => {
          this.errorMessage = error.error.message;
        }
      );
  }

  private getTestEnvironments(): void {
    this.testEnvironmentsSubscription = this.testEnvironmentService
      .getTestEnvironments()
      .subscribe(
        (testEnvironmentsData) => {
          this.dynamicDataSource = new MatTableDataSource(testEnvironmentsData);
          this.dynamicDataSource.paginator = this.paginator;
          this.dynamicDataSource.sort = this.sort;
        },
        (error: ErrorEvent) => {
          this.errorMessage = error.error.message;
        }
      );
  }

  private resetTables(): void {
    this.testEnvironmentsSubscription.unsubscribe();
    this.route.params.subscribe((poolParam) => {
      if (Object.keys(poolParam).length !== 0) {
        this.poolName = poolParam.poolName;
        this.getTestEnvironmentsByPool(this.poolName);
      } else {
        this.getTestEnvironments();
      }
    });
  }

  private listenForEvents(): void {
    this.ioConnection = this.socketService
      .onTestEnvironmentMessage()
      .subscribe((message: string) => {
        if (message.includes('test environment updated')) {
          this.resetTables();
        }
      });
  }

  private openErrorSnackBar(message: string, error: any): void {
    const errorMessage = error.message ? error.message : error.toString();
    this.snackBar.open(`${message}: ${errorMessage}`, 'X', {
      panelClass: 'error-snackbar-class',
    });
  }
}

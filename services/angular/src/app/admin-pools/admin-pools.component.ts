
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '../alert/alert.component';
import { PoolsService } from '../services/pools.service';
import { AddPoolComponent } from './crud-operations/add-pool.component';
import { RemovePoolComponent } from './crud-operations/remove-pool.component';

@Component({
  selector: 'app-admin-pool',
  styleUrls: ['./admin-pools.component.css'],
  templateUrl: './admin-pools.component.html',
})

export class AdminPoolsComponent implements OnInit {
  givenPool = '';
  enterPoolForm!: FormGroup;
  poolNameControl!: AbstractControl;

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private poolsService: PoolsService,
  ) { }

  public ngOnInit(): void {
    this.enterPoolForm = this.formBuilder.group({
      poolNameControl: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9-_]+$'),
      ])),
    });
  }

  public async addPool(): Promise<void> {
    const poolExists = await this.poolsService.checkIfPoolExists(this.givenPool);
    if (!poolExists) {
      this.dialog.open(AddPoolComponent, {
        width: '540px',
        data: {
          poolName: this.givenPool,
        },
      });
    } else {
      this.dialog.open(AlertComponent, {
        data: {
          message: `Pool ${this.givenPool} already exists in RPT`,
        },
      });
    }
    this.givenPool = '';
  }

  public async removePool(): Promise<void> {
    const poolExists = await this.poolsService.checkIfPoolExists(this.givenPool);
    if (poolExists) {
      this.dialog.open(RemovePoolComponent, {
        data: {
          poolToRemove: this.givenPool,
        },
      });
      this.givenPool = '';
    } else {
      this.dialog.open(AlertComponent, {
        data: {
          message: `Pool ${this.givenPool} does not exist in RPT`,
        },
      });
    }
  }
}

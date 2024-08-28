import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Pool } from '../../models/pool';
import { PoolsService } from 'src/app/services/pools.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-add-pool',
  templateUrl: './add-pool.component.html',
  styleUrls: ['./add-pool.component.css'],
})

export class AddPoolComponent implements OnInit {
  public addPoolForm!: FormGroup;
  public pool: Pool = new Pool();
  public crudAction = 'Add';
  public dropdownSettings = {};
  public testingAreas = ['App Staging', 'Product Staging', 'Product Release', 'Microservice CI', 'AAS'];
  private username = this.authService.getCookie('signum');
  private errorMessage = '';

  constructor(
    public dialogRef: MatDialogRef<AddPoolComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private poolsService: PoolsService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    ) { }

  public ngOnInit(): void {
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'name',
      textField: 'name',
      allowSearchFilter: true,
      enableCheckAll: false,
    };
    this.addPoolForm = this.formBuilder.group(
      {
        creatorArea: new FormControl('', Validators.required),
        creatorName: new FormControl('', Validators.required),
      },
    );
    this.pool.creatorDetails.name = this.username;
  }

  public closeDialogModal(): void {
    this.dialogRef.close();
  }

  public async applyChanges(): Promise<void> {
    this.pool.poolName = this.data.poolName;
    this.pool.creatorDetails.area = this.pool.creatorDetails.area[0];
    try {
      const postedPool = await this.poolsService.addPool(this.pool);
      if (!postedPool) {
        throw new Error('Invalid Response back from create pool request');
      }
      this.openInfoSnackBar(`Pool Added: ${this.data.poolName}`);
    } catch (error) {
      this.errorMessage = `ERROR: Failed to add the Pool ${this.data.poolName}`;
      this.openErrorSnackBar(this.errorMessage, error);
      if (!environment.production) {
        console.log(error);
      }
    }
    this.closeDialogModal();
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

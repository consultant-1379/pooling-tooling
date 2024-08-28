import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Pool } from 'src/app/models/pool';
import { PoolsService } from 'src/app/services/pools.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-remove-pool',
  templateUrl: './remove-pool.component.html',
  styleUrls: ['./remove-pool.component.css'],
})

export class RemovePoolComponent implements OnInit {
  public poolToRemove = '';
  public removePoolForm!: FormGroup;
  private pool: Pool = new Pool();
  private errorMessage = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RemovePoolComponent>,
    private formBuilder: FormBuilder,
    private poolService: PoolsService,
    private snackBar: MatSnackBar,
  ) { }

  public ngOnInit(): void {
    this.removePoolForm = this.formBuilder.group(
      {
        poolToRemove: new FormControl(
          '',
          [
            Validators.required,
            (poolToRemoveCtrl: AbstractControl): ValidationErrors | null => {
              if (poolToRemoveCtrl.value !== this.data.poolToRemove) {
                return { invalid: true };
              }
              return null;
            }
          ],
        ),
      }
    );
    this.getPoolInfo();
  }

  public closeDialogModal(): void {
    this.dialogRef.close();
  }

  public removePool(): void {
    this.poolService.removePool(this.pool)
      .subscribe(
        () => {
          this.openInfoSnackBar(`Pool deleted: ${this.data.poolToRemove}`);
        },
        (error) => {
          if (error.error.error.includes('test environments attached to pool')) {
            this.errorMessage = 'Could not delete Pool as test environments ' +
            'are attached. Please reallocate these test environments to another pool and try again';
            this.openErrorSnackBar(this.errorMessage, error);
          } else {
            this.errorMessage = 'Could not delete Pool';
            this.openErrorSnackBar(this.errorMessage, error);
            if (!environment.production) {
              console.log(error);
            }
          }
        }
      );
    this.closeDialogModal();
  }

  private getPoolInfo(): void {
    this.poolService.getPoolByName(this.data.poolToRemove)
      .subscribe(
        (pools) => {
          this.pool = pools[0];
        },
        (error) => {
          this.errorMessage = 'An internal error has occurred and the pool ' +
          'details could not be retrieved';
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


import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '../alert/alert.component';
import { TestEnvironmentService } from '../services/test-environment.service';
import { AddTestEnvironmentComponent } from './crud-operations/add-test-environment.component';
import { EditTestEnvironmentComponent } from './crud-operations/edit-test-environment.component';
import { RemoveTestEnvironmentComponent } from './crud-operations/remove-test-environment.component';

@Component({
  selector: 'app-admin-test-environment',
  styleUrls: ['./admin-test-environment.component.css'],
  templateUrl: './admin-test-environment.component.html',
})

export class AdminTestEnvironmentComponent implements OnInit {
  givenEnvironment = '';
  enterEnvironmentForm!: FormGroup;
  environmentNameControl!: AbstractControl;

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private testEnvironmentService: TestEnvironmentService,
  ) { }

  public ngOnInit(): void {
    this.enterEnvironmentForm = this.formBuilder.group({
      environmentNameControl: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9-_]+$'),
      ])),
    });
    this.environmentNameControl = this.enterEnvironmentForm.get('environmentNameControl') as FormGroup;
  }

  public async addEnvironment(): Promise<void> {
    const environmentExists = await this.testEnvironmentService.checkIfEnvironmentExists(this.givenEnvironment);
    if (!environmentExists) {
      this.dialog.open(AddTestEnvironmentComponent, {
        width: '540px',
        data: {
          testEnvironmentName: this.givenEnvironment,
        },
      });
    } else {
      this.dialog.open(AlertComponent, {
        data: {
          message: `Test Environment ${this.givenEnvironment} already exists in RPT`,
        },
      });
    }
    this.givenEnvironment = '';
  }

  public async editEnvironment(): Promise<void> {
    const environmentExists = await this.testEnvironmentService.checkIfEnvironmentExists(this.givenEnvironment);
    if (environmentExists) {
      this.dialog.open(EditTestEnvironmentComponent, {
        width: '540px',
        data: {
          testEnvironmentName: this.givenEnvironment,
        },
      });
      this.givenEnvironment = '';
    } else {
      this.dialog.open(AlertComponent, {
        data: {
          message: `Test Environment ${this.givenEnvironment} does not exist in RPT`,
        },
      });
    }
  }

  public async removeEnvironment(): Promise<void> {
    const environmentExists = await this.testEnvironmentService.checkIfEnvironmentExists(this.givenEnvironment);
    if (environmentExists) {
      this.dialog.open(RemoveTestEnvironmentComponent, {
        data: {
          testEnvironmentToRemove: this.givenEnvironment,
        },
      });
      this.givenEnvironment = '';
    } else {
      this.dialog.open(AlertComponent, {
        data: {
          message: `Test Environment ${this.givenEnvironment} does not exist in RPT`,
        },
      });
    }
  }
}

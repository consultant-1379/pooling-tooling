import { Component, Inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dynamic-modal',
  templateUrl: './dynamic-modal.component.html',
  styleUrls: ['./dynamic-modal.component.css'],
})
export class DynamicModalComponent implements OnInit {
  public dynamicModalDataSource!: MatTableDataSource<any>;
  public displayedColumnIds: any[] = [];
  public displayedColumnNames: any[] = [];
  public title = '';

  constructor(
    public dialogRef: MatDialogRef<DynamicModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.displayedColumnIds = this.data.displayedColumnIds;
    this.displayedColumnNames = this.data.displayedColumnNames;
    this.title = this.data.title;
    this.dynamicModalDataSource = new MatTableDataSource([this.data.testEnvironmentPropertyData]);
  }

  closeDialogModal(): void {
    this.dialogRef.close();
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dynamic-schedule-view-all-modal',
  templateUrl: './dynamic-schedule-view-all-modal.component.html',
  styleUrls: ['./dynamic-schedule-view-all-modal.component.css'],
})
export class DynamicScheduleViewAllModalComponent implements OnInit {
  public displayedkeys: any[] = [];
  public title = '';
  displayedColumns: string[] = ['property', 'value'];
  dataSource: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<DynamicScheduleViewAllModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.title = this.data.title;
    this.displayedkeys = this.flattenObject(this.data.schedulePropertyData);
    this.dataSource = this.displayedkeys;
  }

  closeDialogModal(): void {
    this.dialogRef.close();
  }

  flattenObject(obj: any): any[] {
    const flattenedKeys: any[] = [];
    const stack = [{ value: obj, prefix: '' }];
    while (stack.length > 0) {
        const poppedValue = stack.pop();
        if (!poppedValue) {
            continue;
        }
        const { value, prefix } = poppedValue;
        for (const key in value) {
            if (value.hasOwnProperty(key)) {
                const element = value[key];
                if (typeof element === 'object' && element !== null) {
                    if (Array.isArray(element)) {
                        flattenedKeys.push({ property: prefix + key, value: element });
                    } else {
                        stack.push({ value: element, prefix: prefix + key + '.' });
                    }
                } else {
                    flattenedKeys.push({ property: prefix + key, value: element });
                }
            }
        }
    }
    return flattenedKeys;
}


}

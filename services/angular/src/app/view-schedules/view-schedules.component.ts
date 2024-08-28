import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './view-schedules.component.html',
})
export class ViewSchedulesComponent {
  public modalTitle = '';

  constructor(public router: Router) {}
}

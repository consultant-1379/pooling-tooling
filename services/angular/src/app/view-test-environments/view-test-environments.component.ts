import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './view-test-environments.component.html',
})
export class ViewTestEnvironmentsComponent {
  public modalTitle = '';

  constructor(public router: Router) {}
}

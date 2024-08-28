import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewTestEnvironmentsComponent } from './view-test-environments.component';

const routes: Routes = [
  { path: '', component: ViewTestEnvironmentsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewTestEnvironmentsRoutingModule { }

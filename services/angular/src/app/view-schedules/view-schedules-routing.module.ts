import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewSchedulesComponent } from './view-schedules.component';

const routes: Routes = [
  { path: '', component: ViewSchedulesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewSchedulesRoutingModule { }

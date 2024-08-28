import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminScheduleComponent } from './admin-schedule.component';

const routes: Routes = [{ path: '', component: AdminScheduleComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminSchedulesRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminTestEnvironmentComponent } from './admin-test-environment.component';

const routes: Routes = [{ path: '', component: AdminTestEnvironmentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminTestEnvironmentsRoutingModule { }

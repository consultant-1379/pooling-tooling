import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPoolsComponent } from './admin-pools.component';

const routes: Routes = [{ path: '', component: AdminPoolsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminPoolsRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelpDocsLandingPageComponent } from './help-docs-landing-page.component';
import { HelpDocsEnvironmentsComponent } from './test-environments/help-docs-test-environments.component';
import { HelpDocsPoolsComponent } from './pools/help-docs-pools.component';
import { HelpDocsSchedulesComponent } from './schedules/help-docs-schedules.component';
import {
  HelpDocsTestEnvironmentsAdministrationComponent
} from './test-environments-administration/help-docs-test-environments-administration.component';
import { HelpDocsPoolsAdministrationComponent } from './pools-administration/help-docs-pools-administration.component';
import { HelpDocsSchedulesAdministrationComponent } from './schedules-administration/help-docs-schedules-administration.component';

const routes: Routes = [
  { path: '', component: HelpDocsLandingPageComponent },
  { path: 'test-environments', component: HelpDocsEnvironmentsComponent },
  { path: 'pools', component: HelpDocsPoolsComponent },
  { path: 'schedules', component: HelpDocsSchedulesComponent },
  { path: 'test-environments-administration', component: HelpDocsTestEnvironmentsAdministrationComponent },
  { path: 'pools-administration', component: HelpDocsPoolsAdministrationComponent},
  { path: 'schedules-administration', component: HelpDocsSchedulesAdministrationComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HelpDocsRoutingModule { }

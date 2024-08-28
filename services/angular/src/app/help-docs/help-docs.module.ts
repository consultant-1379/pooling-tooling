import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HelpDocsRoutingModule } from './help-docs-routing.module';
import { HelpDocsLandingPageComponent } from './help-docs-landing-page.component';
import { HelpDocsEnvironmentsComponent } from './test-environments/help-docs-test-environments.component';
import { HelpDocsPoolsComponent } from './pools/help-docs-pools.component';
import { HelpDocsSchedulesComponent } from './schedules/help-docs-schedules.component';
import { HelpDocsNavigationComponent } from './navigation/help-docs-navigation.component';
import {
  HelpDocsTestEnvironmentsAdministrationComponent
} from './test-environments-administration/help-docs-test-environments-administration.component';
import { HelpDocsPoolsAdministrationComponent } from './pools-administration/help-docs-pools-administration.component';
import { HelpDocsSchedulesAdministrationComponent } from './schedules-administration/help-docs-schedules-administration.component';

import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    HelpDocsLandingPageComponent,
    HelpDocsNavigationComponent,
    HelpDocsEnvironmentsComponent,
    HelpDocsPoolsComponent,
    HelpDocsSchedulesComponent,
    HelpDocsTestEnvironmentsAdministrationComponent,
    HelpDocsPoolsAdministrationComponent,
    HelpDocsSchedulesAdministrationComponent,
  ],
  imports: [
    MatIconModule,
    CommonModule,
    HelpDocsRoutingModule,
  ]
})
export class HelpDocsModule { }

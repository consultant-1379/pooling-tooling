import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService as AuthGuard } from './services/auth-guard.service';
import { LoggedInAuthGuardService as LoggedInAuthGuard } from './services/logged-in-auth-guard.service';
import { LandingPageComponent } from './landing-page/landing-page.component';

const routes: Routes = [
  { path: 'login', canActivate : [LoggedInAuthGuard],
    loadChildren: () => import('./login-page/login-page.module')
    .then(m => m.LoginPageModule) },
  { path: '', component: LandingPageComponent, canActivate : [AuthGuard]},
  { path: 'test-environments', canActivate : [AuthGuard],
    loadChildren: () => import('./view-test-environments/view-test-environments.module')
    .then(m => m.ViewTestEnvironmentsModule) },
  { path: 'pools/:poolName', canActivate : [AuthGuard],
    loadChildren: () => import('./view-test-environments/view-test-environments.module')
    .then(m => m.ViewTestEnvironmentsModule) },
  { path: 'admin/test-environments', canActivate : [AuthGuard],
    loadChildren: () => import('./admin-test-environments/admin-test-environments.module')
    .then(m => m.AdminTestEnvironmentsModule) },
  { path: 'admin/pools', canActivate : [AuthGuard],
    loadChildren: () => import('./admin-pools/admin-pools.module')
    .then(m => m.AdminPoolsModule) },
  { path: 'admin/schedules', canActivate : [AuthGuard],
    loadChildren: () => import('./admin-schedules/admin-schedules.module')
    .then(m => m.AdminSchedulesModule) },
  { path: 'schedules', canActivate : [AuthGuard],
  loadChildren: () => import('./view-schedules/view-schedules.module')
  .then(m => m.ViewSchedulesModule) },
  { path: 'help-docs', canActivate : [AuthGuard],
    loadChildren: () => import('./help-docs/help-docs.module')
    .then(m => m.HelpDocsModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule { }

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardWithForcedLogin} from './core/auth-guard-with-forced-login.service';
import {RoleGuard} from './core/role-guard.service';
import {ChildRoleGuard} from "./core/child-role-guard.service";

const routes: Routes = [
  { path: '**', redirectTo: 'not-found'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
  providers: [AuthGuardWithForcedLogin, RoleGuard, ChildRoleGuard],
})
export class AppRoutingModule {
}

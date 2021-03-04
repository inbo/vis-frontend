import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ReleaseNotesPageComponent} from "./release-notes-page/release-notes-page.component";
import {AuthGuardWithForcedLogin} from "../core/auth-guard-with-forced-login.service";

const routes: Routes = [
  {path: 'releases', component: ReleaseNotesPageComponent, canActivate: [AuthGuardWithForcedLogin]},
  {path: 'releases/:release', component: ReleaseNotesPageComponent, canActivate: [AuthGuardWithForcedLogin]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReleaseNotesRoutingModule { }

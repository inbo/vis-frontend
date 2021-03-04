import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardWithForcedLogin} from "./core/auth-guard-with-forced-login.service";
import {ReleaseNotesPageComponent} from './release-notes/release-notes-page/release-notes-page.component';

const routes: Routes = [

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuardWithForcedLogin],
})
export class AppRoutingModule {
}

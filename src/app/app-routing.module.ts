import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardPageComponent} from "./dashboard-page/dashboard-page.component";
import {AuthGuardWithForcedLogin} from "./core/auth-guard-with-forced-login.service";
import {WelcomePageComponent} from "./welcome-page/welcome-page.component";
import {ProjectsOverviewPageComponent} from "./project/projects-overview-page/projects-overview-page.component";
import {LocationOverviewPageComponent} from "./location/location-overview-page/location-overview-page.component";
import {FishSpeciesOverviewPageComponent} from "./fish-specie/fish-species-overview-page/fish-species-overview-page.component";
import {MethodsOverviewPageComponent} from "./method/methods-overview-page/methods-overview-page.component";
import {FishIndexPageComponent} from "./fish-index-page/fish-index-page.component";
import {ProfilePageComponent} from "./profile-page/profile-page.component";
import {ProjectDetailPageComponent} from "./project/project-detail-page/project-detail-page.component";
import {ProjectObservationsPageComponent} from "./project/project-observations-page/project-observations-page.component";
import {ProjectHabitatPageComponent} from "./project/project-habitat-page/project-habitat-page.component";
import {ProjectMethodsPageComponent} from "./project/project-methods-page/project-methods-page.component";
import {ProjectFishSpeciesPageComponent} from "./project/project-fish-species-page/project-fish-species-page.component";
import {ProjectPicturesPageComponent} from "./project/project-pictures-page/project-pictures-page.component";
import {ProjectLocationsPageComponent} from "./project/project-locations-page/project-locations-page.component";
import {ProjectDetailEditPageComponent} from "./project/project-detail-edit-page/project-detail-edit-page.component";
import {ReleaseNotesPageComponent} from './release-notes/release-notes-page/release-notes-page.component';

const routes: Routes = [
  {path: '', component: WelcomePageComponent, pathMatch: 'full'},
  {path: 'dashboard', component: DashboardPageComponent, canActivate: [AuthGuardWithForcedLogin]},
  {path: 'projecten', component: ProjectsOverviewPageComponent, canActivate: [AuthGuardWithForcedLogin]},
  {path: 'projecten/:projectCode', component: ProjectDetailPageComponent, canActivate: [AuthGuardWithForcedLogin], pathMatch: 'full'},
  {path: 'projecten/:projectCode/bewerk', component: ProjectDetailEditPageComponent, canActivate: [AuthGuardWithForcedLogin]},
  {path: 'projecten/:projectCode/waarnemingen', component: ProjectObservationsPageComponent, canActivate: [AuthGuardWithForcedLogin]},
  {path: 'projecten/:projectCode/locaties', component: ProjectLocationsPageComponent, canActivate: [AuthGuardWithForcedLogin]},
  {path: 'projecten/:projectCode/habitat', component: ProjectHabitatPageComponent, canActivate: [AuthGuardWithForcedLogin]},
  {path: 'projecten/:projectCode/methoden', component: ProjectMethodsPageComponent, canActivate: [AuthGuardWithForcedLogin]},
  {path: 'projecten/:projectCode/vissoorten', component: ProjectFishSpeciesPageComponent, canActivate: [AuthGuardWithForcedLogin]},
  {path: 'projecten/:projectCode/afbeeldingen', component: ProjectPicturesPageComponent, canActivate: [AuthGuardWithForcedLogin]},
  {path: 'locaties', component: LocationOverviewPageComponent, canActivate: [AuthGuardWithForcedLogin]},
  {path: 'vissoorten', component: FishSpeciesOverviewPageComponent, canActivate: [AuthGuardWithForcedLogin]},
  {path: 'methoden', component: MethodsOverviewPageComponent, canActivate: [AuthGuardWithForcedLogin]},
  {path: 'visindex', component: FishIndexPageComponent, canActivate: [AuthGuardWithForcedLogin]},
  {path: 'profiel', component: ProfilePageComponent, canActivate: [AuthGuardWithForcedLogin]},
  {path: 'releases', component: ReleaseNotesPageComponent, canActivate: [AuthGuardWithForcedLogin]},
  {path: 'releases/:release', component: ReleaseNotesPageComponent, canActivate: [AuthGuardWithForcedLogin]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuardWithForcedLogin],
})
export class AppRoutingModule {
}

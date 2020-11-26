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

const routes: Routes = [
  {path: '', component: WelcomePageComponent, pathMatch: 'full'},
  {path: 'dashboard', component: DashboardPageComponent},
  {path: 'projecten', component: ProjectsOverviewPageComponent},
  {path: 'locaties', component: LocationOverviewPageComponent},
  {path: 'vissoorten', component: FishSpeciesOverviewPageComponent},
  {path: 'methoden', component: MethodsOverviewPageComponent},
  {path: 'visindex', component: FishIndexPageComponent},
  {path: 'profiel', component: ProfilePageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuardWithForcedLogin],
})
export class AppRoutingModule {
}

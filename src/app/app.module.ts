import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SidebarLayoutComponent} from './shared-ui/layouts/sidebar-layout/sidebar-layout.component';
import {DashboardPageComponent} from './dashboard-page/dashboard-page.component';
import {NavigationLinkComponent} from './shared-ui/layouts/sidebar-layout/navigation-link/navigation-link.component';
import {NgTransitionModule} from "ng-transition";
import {CommonModule} from "@angular/common";
import {CoreModule} from "./core/core.module";
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import {ProfileDropdownComponent} from "./shared-ui/profile-dropdown/profile-dropdown.component";
import { StackedLayoutComponent } from './shared-ui/layouts/stacked-layout/stacked-layout.component';
import { ProjectsOverviewPageComponent } from './project/projects-overview-page/projects-overview-page.component';
import { LocationOverviewPageComponent } from './location/location-overview-page/location-overview-page.component';
import { FishSpeciesOverviewPageComponent } from './fish-specie/fish-species-overview-page/fish-species-overview-page.component';
import { MethodsOverviewPageComponent } from './method/methods-overview-page/methods-overview-page.component';
import { FishIndexPageComponent } from './fish-index-page/fish-index-page.component';
import { BreadcrumbComponent } from './shared-ui/breadcrumb/breadcrumb.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';


@NgModule({
  declarations: [
    AppComponent,
    SidebarLayoutComponent,
    NavigationLinkComponent,
    DashboardPageComponent,
    WelcomePageComponent,
    ProfileDropdownComponent,
    StackedLayoutComponent,
    ProjectsOverviewPageComponent,
    LocationOverviewPageComponent,
    FishSpeciesOverviewPageComponent,
    MethodsOverviewPageComponent,
    FishIndexPageComponent,
    BreadcrumbComponent,
    ProfilePageComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    CoreModule.forRoot(),
    NgTransitionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

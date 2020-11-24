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


@NgModule({
  declarations: [
    AppComponent,
    SidebarLayoutComponent,
    NavigationLinkComponent,
    DashboardPageComponent,
    WelcomePageComponent,
    ProfileDropdownComponent
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

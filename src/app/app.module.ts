import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SidebarLayoutComponent} from './shared-ui/layouts/sidebar-layout/sidebar-layout.component';
import {DashboardPageComponent} from './dashboard-page/dashboard-page.component';
import {NavigationLinkComponent} from './shared-ui/layouts/sidebar-layout/navigation-link/navigation-link.component';
import {NgTransitionModule} from "ng-transition";
import {CommonModule} from "@angular/common";


@NgModule({
  declarations: [
    AppComponent,
    SidebarLayoutComponent,
    NavigationLinkComponent,
    DashboardPageComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    NgTransitionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

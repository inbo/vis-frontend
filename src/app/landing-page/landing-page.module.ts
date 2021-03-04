import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingPageRoutingModule } from './landing-page-routing.module';
import {WelcomePageComponent} from "./welcome-page/welcome-page.component";
import {NgTransitionModule} from "ng-transition";


@NgModule({
  declarations: [
    WelcomePageComponent
  ],
  imports: [
    CommonModule,
    LandingPageRoutingModule,
    NgTransitionModule
  ]
})
export class LandingPageModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReleaseNotesRoutingModule } from './release-notes-routing.module';
import {ReleaseNotesPageComponent} from "./release-notes-page/release-notes-page.component";
import {ReleaseNotesPopupComponent} from "./release-notes-popup/release-notes-popup.component";
import {ReleaseNotesTabsComponent} from "./release-notes-tabs/release-notes-tabs.component";
import {SharedUiModule} from "../shared-ui/shared-ui.module";


@NgModule({
  declarations: [
    ReleaseNotesPageComponent,
    ReleaseNotesPopupComponent,
    ReleaseNotesTabsComponent,
  ],
  exports: [
    ReleaseNotesPopupComponent
  ],
  imports: [
    CommonModule,
    ReleaseNotesRoutingModule,
    SharedUiModule
  ]
})
export class ReleaseNotesModule { }

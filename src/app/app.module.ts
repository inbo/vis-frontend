import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';

import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {HttpClient} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SidebarLayoutComponent} from './shared-ui/layouts/sidebar-layout/sidebar-layout.component';
import {DashboardPageComponent} from './dashboard-page/dashboard-page.component';
import {NavigationLinkComponent} from './shared-ui/layouts/sidebar-layout/navigation-link/navigation-link.component';
import {NgTransitionModule} from "ng-transition";
import {CommonModule} from "@angular/common";
import {CoreModule} from "./core/core.module";
import {WelcomePageComponent} from './welcome-page/welcome-page.component';
import {ProfileDropdownComponent} from "./shared-ui/profile-dropdown/profile-dropdown.component";
import {StackedLayoutComponent} from './shared-ui/layouts/stacked-layout/stacked-layout.component';
import {ProjectsOverviewPageComponent} from './project/projects-overview-page/projects-overview-page.component';
import {LocationOverviewPageComponent} from './location/location-overview-page/location-overview-page.component';
import {FishSpeciesOverviewPageComponent} from './fish-specie/fish-species-overview-page/fish-species-overview-page.component';
import {MethodsOverviewPageComponent} from './method/methods-overview-page/methods-overview-page.component';
import {FishIndexPageComponent} from './fish-index-page/fish-index-page.component';
import {BreadcrumbComponent} from './shared-ui/breadcrumb/breadcrumb.component';
import {ProfilePageComponent} from './profile-page/profile-page.component';
import {PagingAsyncComponent} from "./shared-ui/paging-async/paging-async.component";
import {PagingComponent} from "./shared-ui/paging/paging.component";
import {LoadingSpinnerComponent} from "./shared-ui/loading-spinner/loading-spinner.component";
import {ProjectDetailPageComponent} from './project/project-detail-page/project-detail-page.component';
import {ProjectObservationsPageComponent} from './project/project-observations-page/project-observations-page.component';
import {ProjectLocationsPageComponent} from './project/project-locations-page/project-locations-page.component';
import {ProjectHabitatPageComponent} from './project/project-habitat-page/project-habitat-page.component';
import {ProjectMethodsPageComponent} from './project/project-methods-page/project-methods-page.component';
import {ProjectFishSpeciesPageComponent} from './project/project-fish-species-page/project-fish-species-page.component';
import {ProjectPicturesPageComponent} from './project/project-pictures-page/project-pictures-page.component';
import {ProjectTabsComponent} from './project/project-tabs/project-tabs.component';
import {ProjectDetailEditPageComponent} from './project/project-detail-edit-page/project-detail-edit-page.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ToggleWithIconComponent} from './shared-ui/toggle-with-icon/toggle-with-icon.component';
import { DatepickerComponent } from './shared-ui/datepicker/datepicker.component';
import { SlideOverComponent } from './shared-ui/slide-over/slide-over.component';
import { ProjectAddComponent } from './project/project-add/project-add.component';
import {AlertModule} from "./_alert";
import { ReleaseNotesPageComponent } from './release-notes/release-notes-page/release-notes-page.component';
import { ReleaseNotesPopupComponent } from './release-notes/release-notes-popup/release-notes-popup.component';
import { ReleaseNotesTabsComponent } from './release-notes/release-notes-tabs/release-notes-tabs.component';
import { TextCounterComponent } from './shared-ui/text-counter/text-counter.component';
import {ExpandableFilterComponent} from "./shared-ui/expandable-filter/expandable-filter.component";
import { ObservationStatusPillComponent } from './observations/observation-status-pill/observation-status-pill.component';
import {VisService} from "./vis.service";



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
    ProfilePageComponent,
    PagingAsyncComponent,
    PagingComponent,
    LoadingSpinnerComponent,
    ProjectDetailPageComponent,
    ProjectObservationsPageComponent,
    ProjectLocationsPageComponent,
    ProjectHabitatPageComponent,
    ProjectMethodsPageComponent,
    ProjectFishSpeciesPageComponent,
    ProjectPicturesPageComponent,
    ProjectTabsComponent,
    ProjectDetailEditPageComponent,
    ToggleWithIconComponent,
    DatepickerComponent,
    SlideOverComponent,
    ProjectAddComponent,
    ReleaseNotesPageComponent,
    ReleaseNotesPopupComponent,
    ReleaseNotesTabsComponent,
    TextCounterComponent,
    ExpandableFilterComponent,
    ObservationStatusPillComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    CoreModule.forRoot(),
    NgTransitionModule,
    FormsModule,
    ReactiveFormsModule,
    AlertModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: 'nl'
    })
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [TranslateService, VisService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function appInitializerFactory(translate: TranslateService, visService: VisService) {
  return () => {
    return visService.translations('nl').subscribe(value => {
      translate.setTranslation('nl', value, true);
      translate.setDefaultLang('nl');
      return translate.use('nl').toPromise();
    })
  };
}

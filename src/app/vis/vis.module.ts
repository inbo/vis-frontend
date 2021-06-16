import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';

import {VisRoutingModule} from './vis-routing.module';
import {DashboardPageComponent} from './dashboard-page/dashboard-page.component';
import {ProjectsOverviewPageComponent} from './project/projects-overview-page/projects-overview-page.component';
import {LocationOverviewPageComponent} from './location/location-overview-page/location-overview-page.component';
import {FishSpeciesOverviewPageComponent} from './fish-specie/fish-species-overview-page/fish-species-overview-page.component';
import {MethodsOverviewPageComponent} from './method/methods-overview-page/methods-overview-page.component';
import {ProfilePageComponent} from './profile-page/profile-page.component';
import {ProjectDetailPageComponent} from './project/project-detail-page/project-detail-page.component';
import {ProjectSurveyEventsPageComponent} from './project/project-survey-events-page/project-survey-events-page.component';
import {ProjectLocationsPageComponent} from './project/project-locations-page/project-locations-page.component';
import {ProjectMethodsPageComponent} from './project/project-methods-page/project-methods-page.component';
import {ProjectFishSpeciesPageComponent} from './project/project-fish-species-page/project-fish-species-page.component';
import {ProjectPicturesPageComponent} from './project/project-pictures-page/project-pictures-page.component';
import {ProjectTabsComponent} from './project/project-tabs/project-tabs.component';
import {ProjectDetailEditPageComponent} from './project/project-detail-edit-page/project-detail-edit-page.component';
import {ProjectAddComponent} from './project/project-add/project-add.component';
import {SurveyEventStatusPillComponent} from './survey-events/survey-event-status-pill/survey-event-status-pill.component';
import {SurveyEventDetailPageComponent} from './survey-events/survey-event-detail-page/survey-event-detail-page.component';
import {SurveyEventTabsComponent} from './survey-events/survey-event-tabs/survey-event-tabs.component';
import {SurveyEventParametersPageComponent} from './survey-events/survey-event-parameters-page/survey-event-parameters-page.component';
import {SurveyEventMethodPageComponent} from './survey-events/survey-event-method-page/survey-event-method-page.component';
import {SurveyEventHabitatPageComponent} from './survey-events/survey-event-habitat-page/survey-event-habitat-page.component';
import {SurveyEventTrajectPageComponent} from './survey-events/survey-event-traject-page/survey-event-traject-page.component';
import {SurveyEventMeasurementsPageComponent} from './survey-events/survey-event-measurements-page/survey-event-measurements-page.component';
import {SurveyEventMeasurementsCreatePageComponent} from './survey-events/survey-event-measurements-create-page/survey-event-measurements-create-page.component';
import {SurveyEventHabitatEditPageComponent} from './survey-events/survey-event-habitat-edit-page/survey-event-habitat-edit-page.component';
import {FishSpeciesDetailPageComponent} from './fish-specie/fish-species-detail-page/fish-species-detail-page.component';
import {SurveyEventParametersEditPageComponent} from './survey-events/survey-event-parameters-edit-page/survey-event-parameters-edit-page.component';
import {SharedUiModule} from '../shared-ui/shared-ui.module';
import {IMaskModule} from 'angular-imask';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {LocationCreatePageComponent} from './location/location-create-page/location-create-page.component';
import {LocationCreateStep1Component} from './location/location-create-step1/location-create-step1.component';
import {LocationCreateStep2Component} from './location/location-create-step2/location-create-step2.component';
import {LocationCreateStep3Component} from './location/location-create-step3/location-create-step3.component';
import {ProjectHeadingComponent} from './project/project-heading/project-heading.component';
import {SurveyEventHeadingComponent} from './survey-events/survey-event-heading/survey-event-heading.component';
import {SurveyEventComponent} from './survey-events/survey-event/survey-event.component';
import {ProjectComponent} from './project/project/project.component';
import {NgTransitionModule} from 'ng-transition';
import {SwitchRoleComponent} from './switch-role/switch-role.component';
import {LeafletMarkerClusterModule} from '@asymmetrik/ngx-leaflet-markercluster';
import {FishingPointsMapComponent} from './components/fishing-points-map/fishing-points-map.component';
import {FishingPointsMapPropertiesComponent} from './components/fishing-points-map-properties/fishing-points-map-properties.component';
import {FormErrorMessageComponent} from './components/form-error-message/form-error-message.component';
import {SurveyEventsOverviewPageComponent} from './survey-events/survey-events-overview-page/survey-events-overview-page.component';
import {TipsComponent} from './tips/tips/tips.component';
import {TipsTabsComponent} from './tips/tips-tabs/tips-tabs.component';
import {TipsPageComponent} from './tips/tips-page/tips-page.component';
import {ClipboardModule} from 'ngx-clipboard';
import {UsersPageComponent} from './users-page/users-page.component';

@NgModule({
  exports: [
    SwitchRoleComponent
  ],
  declarations: [
    DashboardPageComponent,
    ProjectsOverviewPageComponent,
    LocationOverviewPageComponent,
    FishSpeciesOverviewPageComponent,
    MethodsOverviewPageComponent,
    ProfilePageComponent,
    ProjectDetailPageComponent,
    ProjectSurveyEventsPageComponent,
    ProjectLocationsPageComponent,
    ProjectMethodsPageComponent,
    ProjectFishSpeciesPageComponent,
    ProjectPicturesPageComponent,
    ProjectTabsComponent,
    ProjectDetailEditPageComponent,
    ProjectAddComponent,
    SurveyEventStatusPillComponent,
    SurveyEventDetailPageComponent,
    SurveyEventTabsComponent,
    SurveyEventParametersPageComponent,
    SurveyEventMethodPageComponent,
    SurveyEventHabitatPageComponent,
    SurveyEventTrajectPageComponent,
    SurveyEventMeasurementsPageComponent,
    SurveyEventHabitatEditPageComponent,
    FishSpeciesDetailPageComponent,
    SurveyEventParametersEditPageComponent,
    LocationCreatePageComponent,
    LocationCreateStep1Component,
    LocationCreateStep2Component,
    LocationCreateStep3Component,
    ProjectHeadingComponent,
    SurveyEventHeadingComponent,
    SurveyEventComponent,
    ProjectComponent,
    SwitchRoleComponent,
    SurveyEventMeasurementsCreatePageComponent,
    FishingPointsMapComponent,
    FishingPointsMapPropertiesComponent,
    FormErrorMessageComponent,
    SurveyEventsOverviewPageComponent,
    TipsComponent,
    TipsTabsComponent,
    TipsPageComponent,
    UsersPageComponent,
  ],
  imports: [
    CommonModule,
    VisRoutingModule,
    SharedUiModule,
    IMaskModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    LeafletModule,
    LeafletMarkerClusterModule,
    NgTransitionModule,
    ClipboardModule
  ],
  providers: [DatePipe]
})
export class VisModule {
}

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
import {SurveyEventHabitatPageComponent} from './survey-events/survey-event-habitat-page/survey-event-habitat-page.component';
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
import {SettingsComponent} from './settings/settings/settings.component';
import {SettingsTabsComponent} from './settings/settings-tabs/settings-tabs.component';
import {UsersPageComponent} from './settings/users/users-page/users-page.component';
import {UserEditComponent} from './settings/users/user-edit/user-edit.component';
import {TeamAddComponent} from './settings/teams/team-add/team-add.component';
import {MultiUserSearchComponent} from './settings/users/multi-user-search/multi-user-search.component';
import {TeamsPageComponent} from './settings/teams/teams-page/teams-page.component';
import {InstancesPageComponent} from './settings/instances/instances-page/instances-page.component';
import {InstanceAddComponent} from './settings/instances/instance-add/instance-add.component';
import {SurveyEventDetailEditPageComponent} from './survey-events/survey-event-detail-edit-page/survey-event-detail-edit-page.component';
import { SurveyEventAddPageComponent } from './survey-events/survey-event-add-page/survey-event-add-page.component';
import { SurveyEventCopyModalComponent } from './survey-events/survey-event-copy-modal/survey-event-copy-modal.component';
import { LocationDetailComponent } from './location/location-detail/location-detail.component';
import { MeasurementRowComponent } from './survey-events/measurement-row/measurement-row.component';
import { SurveyEventMeasurementsPageComponent } from './survey-events/survey-event-measurements-page/survey-event-measurements-page.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SpeciesSearchComponent } from './survey-events/measurement-components/species-search/species-search.component';
import { MeasurementLengthComponent } from './survey-events/measurement-components/measurement-length/measurement-length.component';
import { MeasurementWeightComponent } from './survey-events/measurement-components/measurement-weight/measurement-weight.component';
import { MeasurementGenderComponent } from './survey-events/measurement-components/measurement-gender/measurement-gender.component';
import { MeasurementAmountComponent } from './survey-events/measurement-components/measurement-amount/measurement-amount.component';
import { MeasurementFishingTripNumberComponent } from './survey-events/measurement-components/measurement-fishing-trip-number/measurement-fishing-trip-number.component';
import { MeasurementCommentComponent } from './survey-events/measurement-components/measurement-comment/measurement-comment.component';
import { MeasurementLengthMeasurementsComponent } from './survey-events/measurement-components/measurement-length-measurements/measurement-length-measurements.component';
import { MeasurementRowReadonlyComponent } from './survey-events/measurement-row-readonly/measurement-row-readonly.component';
import { ImportsOverviewComponent } from './imports/imports-overview/imports-overview.component';
import { ImportsDetailComponent } from './imports/imports-detail/imports-detail.component';
import { ImportsOverviewProcessedComponent } from './imports/imports-overview-processed/imports-overview-processed.component';
import { ImportsDetailSurveyEventComponent } from './imports/container/imports-detail-survey-event/imports-detail-survey-event.component';
import { ImportsDetailMeasurementComponent } from './imports/container/imports-detail-measurement/imports-detail-measurement.component';
import { MethodEditComponent } from './method/method-edit/method-edit.component';

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
    SurveyEventHabitatPageComponent,
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
    UserEditComponent,
    TeamAddComponent,
    MultiUserSearchComponent,
    SettingsComponent,
    SettingsTabsComponent,
    TeamsPageComponent,
    InstancesPageComponent,
    InstanceAddComponent,
    SurveyEventDetailEditPageComponent,
    SurveyEventAddPageComponent,
    SurveyEventCopyModalComponent,
    LocationDetailComponent,
    MeasurementRowComponent,
    SpeciesSearchComponent,
    MeasurementLengthComponent,
    MeasurementWeightComponent,
    MeasurementGenderComponent,
    MeasurementAmountComponent,
    MeasurementFishingTripNumberComponent,
    MeasurementCommentComponent,
    MeasurementLengthMeasurementsComponent,
    MeasurementRowReadonlyComponent,
    ImportsOverviewComponent,
    ImportsDetailComponent,
    ImportsOverviewProcessedComponent,
    ImportsDetailSurveyEventComponent,
    ImportsDetailMeasurementComponent,
    MethodEditComponent,
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
    ClipboardModule,
    FontAwesomeModule
  ],
  providers: [DatePipe]
})
export class VisModule {
}

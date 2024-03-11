import {NgModule} from '@angular/core';
import {CommonModule, DatePipe, NgOptimizedImage} from '@angular/common';

import {VisRoutingModule} from './vis-routing.module';
import {DashboardPageComponent} from './dashboard-page/dashboard-page.component';
import {ProjectsOverviewPageComponent} from './project/projects-overview-page/projects-overview-page.component';
import {FishingPointOverviewPageComponent} from './fishing-point/fishing-point-overview-page/fishing-point-overview-page.component';
import {FishSpeciesOverviewPageComponent} from './fish-specie/fish-species-overview-page/fish-species-overview-page.component';
import {MethodsOverviewPageComponent} from './method/methods-overview-page/methods-overview-page.component';
import {ProfilePageComponent} from './profile-page/profile-page.component';
import {ProjectDetailPageComponent} from './project/project-detail-page/project-detail-page.component';
import {ProjectSurveyEventsPageComponent} from './project/project-survey-events-page/project-survey-events-page.component';
import {ProjectFishingPointsPageComponent} from './project/project-fishing-points-page/project-fishing-points-page.component';
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
import {SurveyEventMeasurementsCreatePageComponent} from './survey-events/measurements/survey-event-measurements-create-page/survey-event-measurements-create-page.component';
import {SurveyEventHabitatEditPageComponent} from './survey-events/survey-event-habitat-edit-page/survey-event-habitat-edit-page.component';
import {FishSpeciesDetailPageComponent} from './fish-specie/fish-species-detail-page/fish-species-detail-page.component';
import {SurveyEventParametersEditPageComponent} from './survey-events/survey-event-parameters-edit-page/survey-event-parameters-edit-page.component';
import {SharedUiModule} from '../shared-ui/shared-ui.module';
import {IMaskModule} from 'angular-imask';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {FishingPointCreatePageComponent} from './fishing-point/fishing-point-create-page/fishing-point-create-page.component';
import {FishingPointCreateStep1Component} from './fishing-point/fishing-point-create-step1/fishing-point-create-step1.component';
import {FishingPointCreateStep2Component} from './fishing-point/fishing-point-create-step2/fishing-point-create-step2.component';
import {FishingPointCreateStep3Component} from './fishing-point/fishing-point-create-step3/fishing-point-create-step3.component';
import {ProjectHeadingComponent} from './project/project-heading/project-heading.component';
import {SurveyEventHeadingComponent} from './survey-events/survey-event-heading/survey-event-heading.component';
import {SurveyEventComponent} from './survey-events/survey-event/survey-event.component';
import {ProjectComponent} from './project/project/project.component';
import {NgTransitionModule} from 'ng-transition';
import {SwitchRoleComponent} from './switch-role/switch-role.component';
import {LeafletMarkerClusterModule} from '@asymmetrik/ngx-leaflet-markercluster';
import {FishingPointsMapComponent} from './components/fishing-points-map/fishing-points-map.component';
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
import {SurveyEventAddPageComponent} from './survey-events/survey-event-add-page/survey-event-add-page.component';
import {SurveyEventCopyModalComponent} from './survey-events/survey-event-copy-modal/survey-event-copy-modal.component';
import {FishingPointDetailComponent} from './fishing-point/fishing-point-detail/fishing-point-detail.component';
import {MeasurementRowComponent} from './survey-events/measurements/measurement-row/measurement-row.component';
import {SurveyEventMeasurementsPageComponent} from './survey-events/measurements/survey-event-measurements-page/survey-event-measurements-page.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {SpeciesSearchComponent} from './survey-events/measurements/measurement-components/species-search/species-search.component';
import {MeasurementLengthComponent} from './survey-events/measurements/measurement-components/measurement-length/measurement-length.component';
import {MeasurementWeightComponent} from './survey-events/measurements/measurement-components/measurement-weight/measurement-weight.component';
import {MeasurementGenderComponent} from './survey-events/measurements/measurement-components/measurement-gender/measurement-gender.component';
import {MeasurementAmountComponent} from './survey-events/measurements/measurement-components/measurement-amount/measurement-amount.component';
import {MeasurementFishingTripNumberComponent} from './survey-events/measurements/measurement-components/measurement-fishing-trip-number/measurement-fishing-trip-number.component';
import {MeasurementCommentComponent} from './survey-events/measurements/measurement-components/measurement-comment/measurement-comment.component';
import {MeasurementLengthMeasurementsComponent} from './survey-events/measurements/measurement-components/measurement-length-measurements/measurement-length-measurements.component';
import {MeasurementRowReadonlyComponent} from './survey-events/measurements/measurement-row-readonly/measurement-row-readonly.component';
import {ImportsOverviewComponent} from './imports/imports-overview/imports-overview.component';
import {ImportsDetailComponent} from './imports/imports-detail/imports-detail.component';
import {ImportsOverviewProcessedComponent} from './imports/imports-overview-processed/imports-overview-processed.component';
import {ImportsDetailSurveyEventComponent} from './imports/container/imports-detail-survey-event/imports-detail-survey-event.component';
import {ImportsDetailMeasurementComponent} from './imports/container/imports-detail-measurement/imports-detail-measurement.component';
import {TeamEditComponent} from './settings/teams/team-edit/team-edit.component';
import {MethodEditComponent} from './method/method-edit/method-edit.component';
import {SurveyEventCpuePageComponent} from './survey-events/survey-event-cpue-page/survey-event-cpue-page.component';
import {SurveyEventCpueEditPageComponent} from './survey-events/survey-event-cpue-edit-page/survey-event-cpue-edit-page.component';
import {FishingPointsSelectedFeatureComponent} from './components/fishing-points-selected-feature/fishing-points-selected-feature.component';
import {HasUnsavedDataGuard} from '../core/unsaved-changes-guard.service';
import {SurveyEventPicturesPageComponent} from './survey-events/survey-event-pictures-page/survey-event-pictures-page.component';
import {UploadFilesComponent} from './survey-events/survey-event-pictures-page/upload-files/upload-files.component';
import {GalleryPageComponent} from './survey-events/survey-event-pictures-page/gallery-page/gallery-page.component';
import {UploadPageComponent} from './survey-events/survey-event-pictures-page/upload-page/upload-page.component';
import {ImageGridItemComponent} from './components/image-grid-item/image-grid-item.component';
import {ImageDetailComponent} from './components/image-detail/image-detail.component';
import {FishSpeciesTabsComponent} from './fish-specie/fish-species-tabs/fish-species-tabs.component';
import {FishSpeciesComponent} from './fish-specie/fish-species/fish-species.component';
import {FishSpeciesPicturesPageComponent} from './fish-specie/fish-species-pictures-page/fish-species-pictures-page.component';
import {FishingPointComponent} from './fishing-point/fishing-point/fishing-point.component';
import {FishingPointTabsComponent} from './fishing-point/fishing-point-tabs/fishing-point-tabs.component';
import {FishingPointPicturesPageComponent} from './fishing-point/fishing-point-pictures-page/fishing-point-pictures-page.component';
import {MeasurementLengthMeasurementsReadonlyComponent} from './survey-events/measurements/measurement-components/measurement-length-measurements-readonly/measurement-length-measurements-readonly.component';
import {NgxLeafletFullscreenModule} from '@runette/ngx-leaflet-fullscreen';
import {UploadInformationComponent} from './survey-events/survey-event-pictures-page/upload-information/upload-information.component';
import {NgxTippyModule} from 'ngx-tippy-wrapper';
import {MeasurementShipSideComponent} from './survey-events/measurements/measurement-components/measurement-ship-side/measurement-ship-side.component';
import {MeasurementDilutionFactorComponent} from './survey-events/measurements/measurement-components/measurement-dilution-factor/measurement-dilution-factor.component';
import {NgArrayPipesModule, NgObjectPipesModule} from 'ngx-pipes';
import {ExistingSurveyEventsFoundWarningComponent} from './survey-events/existing-survey-events-found-warning/existing-survey-events-found-warning.component';
import {ImportsOverviewOpenComponent} from './imports/imports-overview-open/imports-overview-open.component';

@NgModule({
  exports: [
    SwitchRoleComponent,
    SpeciesSearchComponent,
  ],
  declarations: [
    DashboardPageComponent,
    ProjectsOverviewPageComponent,
    FishingPointOverviewPageComponent,
    FishSpeciesOverviewPageComponent,
    MethodsOverviewPageComponent,
    ProfilePageComponent,
    ProjectDetailPageComponent,
    ProjectSurveyEventsPageComponent,
    ProjectFishingPointsPageComponent,
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
    FishingPointCreatePageComponent,
    FishingPointCreateStep1Component,
    FishingPointCreateStep2Component,
    FishingPointCreateStep3Component,
    ProjectHeadingComponent,
    SurveyEventHeadingComponent,
    SurveyEventComponent,
    ProjectComponent,
    SwitchRoleComponent,
    SurveyEventMeasurementsCreatePageComponent,
    FishingPointsMapComponent,
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
    FishingPointDetailComponent,
    MeasurementRowComponent,
    SpeciesSearchComponent,
    MeasurementLengthComponent,
    MeasurementWeightComponent,
    MeasurementGenderComponent,
    MeasurementAmountComponent,
    MeasurementShipSideComponent,
    MeasurementDilutionFactorComponent,
    MeasurementFishingTripNumberComponent,
    MeasurementCommentComponent,
    MeasurementLengthMeasurementsComponent,
    MeasurementRowReadonlyComponent,
    ImportsOverviewComponent,
    ImportsDetailComponent,
    ImportsOverviewOpenComponent,
    ImportsOverviewProcessedComponent,
    ImportsDetailSurveyEventComponent,
    ImportsDetailMeasurementComponent,
    TeamEditComponent,
    MethodEditComponent,
    SurveyEventCpuePageComponent,
    SurveyEventCpueEditPageComponent,
    FishingPointsSelectedFeatureComponent,
    SurveyEventPicturesPageComponent,
    UploadFilesComponent,
    GalleryPageComponent,
    UploadPageComponent,
    UploadInformationComponent,
    ImageGridItemComponent,
    ImageDetailComponent,
    FishSpeciesTabsComponent,
    FishSpeciesComponent,
    FishSpeciesPicturesPageComponent,
    FishingPointComponent,
    FishingPointTabsComponent,
    FishingPointPicturesPageComponent,
    MeasurementLengthMeasurementsReadonlyComponent,
    ExistingSurveyEventsFoundWarningComponent,
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
    FontAwesomeModule,
    NgxLeafletFullscreenModule,
    NgxTippyModule,
    NgArrayPipesModule,
    NgObjectPipesModule,
    NgOptimizedImage,
  ],
  providers: [DatePipe, HasUnsavedDataGuard],
})
export class VisModule {
}

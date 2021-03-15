import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {VisRoutingModule} from './vis-routing.module';
import {DashboardPageComponent} from './dashboard-page/dashboard-page.component';
import {ProjectsOverviewPageComponent} from './project/projects-overview-page/projects-overview-page.component';
import {LocationOverviewPageComponent} from './location/location-overview-page/location-overview-page.component';
import {FishSpeciesOverviewPageComponent} from './fish-specie/fish-species-overview-page/fish-species-overview-page.component';
import {MethodsOverviewPageComponent} from './method/methods-overview-page/methods-overview-page.component';
import {FishIndexPageComponent} from './fish-index-page/fish-index-page.component';
import {ProfilePageComponent} from './profile-page/profile-page.component';
import {ProjectDetailPageComponent} from './project/project-detail-page/project-detail-page.component';
import {ProjectSurveyEventsPageComponent} from './project/project-survey-events-page/project-survey-events-page.component';
import {ProjectLocationsPageComponent} from './project/project-locations-page/project-locations-page.component';
import {ProjectHabitatPageComponent} from './project/project-habitat-page/project-habitat-page.component';
import {ProjectMethodsPageComponent} from './project/project-methods-page/project-methods-page.component';
import {ProjectFishSpeciesPageComponent} from './project/project-fish-species-page/project-fish-species-page.component';
import {ProjectPicturesPageComponent} from './project/project-pictures-page/project-pictures-page.component';
import {ProjectTabsComponent} from './project/project-tabs/project-tabs.component';
import {ProjectDetailEditPageComponent} from './project/project-detail-edit-page/project-detail-edit-page.component';
import {ProjectAddComponent} from './project/project-add/project-add.component';
import {SurveyEventStatusPillComponent} from './survey-events/survey-event-status-pill/survey-event-status-pill.component';
import {SurveyEventDetailPageComponent} from './survey-events/survey-event-detail-page/survey-event-detail-page.component';
import {SurveyEventTabsComponent} from './survey-events/survey-event-tabs/survey-event-tabs.component';
import {SurveyEventParticularitiesPageComponent} from './survey-events/survey-event-particularities-page/survey-event-particularities-page.component';
import {SurveyEventParametersPageComponent} from './survey-events/survey-event-parameters-page/survey-event-parameters-page.component';
import {SurveyEventMethodPageComponent} from './survey-events/survey-event-method-page/survey-event-method-page.component';
import {SurveyEventHabitatPageComponent} from './survey-events/survey-event-habitat-page/survey-event-habitat-page.component';
import {SurveyEventTrajectPageComponent} from './survey-events/survey-event-traject-page/survey-event-traject-page.component';
import {SurveyEventMeasurementsPageComponent} from './survey-events/survey-event-measurements-page/survey-event-measurements-page.component';
import {SurveyEventHabitatEditPageComponent} from './survey-events/survey-event-habitat-edit-page/survey-event-habitat-edit-page.component';
import {FishSpeciesDetailPageComponent} from './fish-specie/fish-species-detail-page/fish-species-detail-page.component';
import {SurveyEventParametersEditPageComponent} from './survey-events/survey-event-parameters-edit-page/survey-event-parameters-edit-page.component';
import {SharedUiModule} from '../shared-ui/shared-ui.module';
import {IMaskModule} from 'angular-imask';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';


@NgModule({
  declarations: [
    DashboardPageComponent,
    ProjectsOverviewPageComponent,
    LocationOverviewPageComponent,
    FishSpeciesOverviewPageComponent,
    MethodsOverviewPageComponent,
    FishIndexPageComponent,
    ProfilePageComponent,
    ProjectDetailPageComponent,
    ProjectSurveyEventsPageComponent,
    ProjectLocationsPageComponent,
    ProjectHabitatPageComponent,
    ProjectMethodsPageComponent,
    ProjectFishSpeciesPageComponent,
    ProjectPicturesPageComponent,
    ProjectTabsComponent,
    ProjectDetailEditPageComponent,
    ProjectAddComponent,
    SurveyEventStatusPillComponent,
    SurveyEventDetailPageComponent,
    SurveyEventTabsComponent,
    SurveyEventParticularitiesPageComponent,
    SurveyEventParametersPageComponent,
    SurveyEventMethodPageComponent,
    SurveyEventHabitatPageComponent,
    SurveyEventTrajectPageComponent,
    SurveyEventMeasurementsPageComponent,
    SurveyEventHabitatEditPageComponent,
    FishSpeciesDetailPageComponent,
    SurveyEventParametersEditPageComponent
  ],
  imports: [
    CommonModule,
    VisRoutingModule,
    SharedUiModule,
    IMaskModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ]
})
export class VisModule {
}

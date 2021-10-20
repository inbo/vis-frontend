import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardPageComponent} from './dashboard-page/dashboard-page.component';
import {AuthGuardWithForcedLogin} from '../core/auth-guard-with-forced-login.service';
import {ProjectsOverviewPageComponent} from './project/projects-overview-page/projects-overview-page.component';
import {ProjectDetailPageComponent} from './project/project-detail-page/project-detail-page.component';
import {ProjectDetailEditPageComponent} from './project/project-detail-edit-page/project-detail-edit-page.component';
import {HasUnsavedDataGuard} from '../core/unsaved-changes-guard.service';
import {ProjectSurveyEventsPageComponent} from './project/project-survey-events-page/project-survey-events-page.component';
import {ProjectLocationsPageComponent} from './project/project-locations-page/project-locations-page.component';
import {ProjectMethodsPageComponent} from './project/project-methods-page/project-methods-page.component';
import {ProjectFishSpeciesPageComponent} from './project/project-fish-species-page/project-fish-species-page.component';
import {ProjectPicturesPageComponent} from './project/project-pictures-page/project-pictures-page.component';
import {SurveyEventDetailPageComponent} from './survey-events/survey-event-detail-page/survey-event-detail-page.component';
import {SurveyEventParametersPageComponent} from './survey-events/survey-event-parameters-page/survey-event-parameters-page.component';
import {SurveyEventParametersEditPageComponent} from './survey-events/survey-event-parameters-edit-page/survey-event-parameters-edit-page.component';
import {SurveyEventHabitatPageComponent} from './survey-events/survey-event-habitat-page/survey-event-habitat-page.component';
import {SurveyEventHabitatEditPageComponent} from './survey-events/survey-event-habitat-edit-page/survey-event-habitat-edit-page.component';
// tslint:disable-next-line:max-line-length
import {SurveyEventMeasurementsPageComponent} from './survey-events/survey-event-measurements-page/survey-event-measurements-page.component';
import {LocationOverviewPageComponent} from './location/location-overview-page/location-overview-page.component';
import {FishSpeciesOverviewPageComponent} from './fish-specie/fish-species-overview-page/fish-species-overview-page.component';
import {FishSpeciesDetailPageComponent} from './fish-specie/fish-species-detail-page/fish-species-detail-page.component';
import {MethodsOverviewPageComponent} from './method/methods-overview-page/methods-overview-page.component';
import {ProfilePageComponent} from './profile-page/profile-page.component';
import {RoleGuard} from '../core/role-guard.service';
import {Role} from '../core/_models/role';
import {LocationCreatePageComponent} from './location/location-create-page/location-create-page.component';
import {SurveyEventComponent} from './survey-events/survey-event/survey-event.component';
import {ProjectComponent} from './project/project/project.component';
import {SurveyEventMeasurementsCreatePageComponent} from './survey-events/survey-event-measurements-create-page/survey-event-measurements-create-page.component';
import {SurveyEventsOverviewPageComponent} from './survey-events/survey-events-overview-page/survey-events-overview-page.component';
import {TipsComponent} from './tips/tips/tips.component';
import {TipsPageComponent} from './tips/tips-page/tips-page.component';
import {AuthGuardRole} from '../core/auth-guard-role.service';
import {UsersPageComponent} from './settings/users/users-page/users-page.component';
import {SettingsComponent} from './settings/settings/settings.component';
import {TeamsPageComponent} from './settings/teams/teams-page/teams-page.component';
import {InstancesPageComponent} from './settings/instances/instances-page/instances-page.component';
import {ChildRoleGuard} from '../core/child-role-guard.service';
import {ProjectEditGuard} from '../core/project-edit-guard.service';
import {SurveyEventDetailEditPageComponent} from './survey-events/survey-event-detail-edit-page/survey-event-detail-edit-page.component';
import {SurveyEventAddPageComponent} from './survey-events/survey-event-add-page/survey-event-add-page.component';
import {LocationDetailComponent} from './location/location-detail/location-detail.component';
import {ImportsOverviewComponent} from './imports/imports-overview/imports-overview.component';
import {ImportsDetailComponent} from './imports/imports-detail/imports-detail.component';
import {ImportsOverviewProcessedComponent} from './imports/imports-overview-processed/imports-overview-processed.component';
import {SurveyEventCpuePageComponent} from './survey-events/survey-event-cpue-page/survey-event-cpue-page.component';
import {SurveyEventCpueEditPageComponent} from './survey-events/survey-event-cpue-edit-page/survey-event-cpue-edit-page.component';

const routes: Routes = [
  {path: 'dashboard', component: DashboardPageComponent, canActivate: [AuthGuardWithForcedLogin]},
  {path: 'projecten', component: ProjectsOverviewPageComponent, canActivate: [AuthGuardWithForcedLogin]},
  {
    path: 'projecten/:projectCode',
    component: ProjectComponent,
    children: [
      {
        path: '',
        component: ProjectDetailPageComponent,
        canActivate: [AuthGuardWithForcedLogin],
        pathMatch: 'full'
      },
      {
        path: 'bewerk',
        component: ProjectDetailEditPageComponent,
        canActivate: [AuthGuardWithForcedLogin, RoleGuard, ProjectEditGuard],
        canDeactivate: [HasUnsavedDataGuard],
        data: {roles: [Role.EditProject]}
      },
      {
        path: 'waarnemingen',
        component: ProjectSurveyEventsPageComponent,
        canActivate: [AuthGuardWithForcedLogin]
      },
      {
        path: 'waarnemingen/toevoegen',
        component: SurveyEventAddPageComponent,
        canActivate: [AuthGuardWithForcedLogin, RoleGuard, ProjectEditGuard],
        canDeactivate: [HasUnsavedDataGuard],
        data: {roles: [Role.CreateSurveyEvent]}
      },
      {path: 'locaties', component: ProjectLocationsPageComponent, canActivate: [AuthGuardWithForcedLogin]},
      {path: 'methoden', component: ProjectMethodsPageComponent, canActivate: [AuthGuardWithForcedLogin]},
      {path: 'vissoorten', component: ProjectFishSpeciesPageComponent, canActivate: [AuthGuardWithForcedLogin]},
      {path: 'afbeeldingen', component: ProjectPicturesPageComponent, canActivate: [AuthGuardWithForcedLogin]},
    ]
  },
  {
    path: 'projecten/:projectCode/waarnemingen/:surveyEventId',
    component: SurveyEventComponent,
    children: [
      {
        path: '',
        component: SurveyEventDetailPageComponent,
        canActivate: [AuthGuardWithForcedLogin],
        data: {name: 'Algemeen', url: ''}
      },
      {
        path: 'bewerk',
        component: SurveyEventDetailEditPageComponent,
        canActivate: [AuthGuardWithForcedLogin, RoleGuard, ProjectEditGuard],
        canDeactivate: [HasUnsavedDataGuard],
        data: {roles: [Role.EditSurveyEvent]}
      },
      {
        path: 'waterkwaliteitsparameters',
        component: SurveyEventParametersPageComponent,
        canActivate: [AuthGuardWithForcedLogin],
        data: {name: 'Waterkwaliteitsparameters', url: 'waterkwaliteitsparameters'}
      },
      {
        path: 'waterkwaliteitsparameters/bewerk',
        component: SurveyEventParametersEditPageComponent,
        canActivate: [AuthGuardWithForcedLogin],
        canDeactivate: [HasUnsavedDataGuard],
        data: {name: 'Waterkwaliteitsparameters', url: 'waterkwaliteitsparameters/bewerk'}
      },
      {
        path: 'habitat',
        component: SurveyEventHabitatPageComponent,
        canActivate: [AuthGuardWithForcedLogin],
        data: {name: 'Hebitat', url: 'habitat'}
      },
      {
        path: 'habitat/bewerk',
        component: SurveyEventHabitatEditPageComponent,
        canActivate: [AuthGuardWithForcedLogin],
        canDeactivate: [HasUnsavedDataGuard],
        data: {name: 'Hebitat', url: 'habitat/bewerk'}
      },
      {
        path: 'metingen',
        component: SurveyEventMeasurementsPageComponent,
        canActivate: [AuthGuardWithForcedLogin],
        data: {name: 'Metingen', url: 'metingen'}
      },
      {
        path: 'metingen/toevoegen',
        component: SurveyEventMeasurementsCreatePageComponent,
        canActivate: [AuthGuardWithForcedLogin],
        canDeactivate: [HasUnsavedDataGuard],
        data: {name: 'Metingen', url: 'metingen/toevoegen'}
      },
      {
        path: 'cpue',
        component: SurveyEventCpuePageComponent,
        canActivate: [AuthGuardWithForcedLogin],
        data: {name: 'cpue', url: 'cpue'}
      },
      {
        path: 'cpue/bewerk',
        component: SurveyEventCpueEditPageComponent,
        canActivate: [AuthGuardWithForcedLogin],
        canDeactivate: [HasUnsavedDataGuard],
        data: {name: 'cpue', url: 'cpue/bewerk'}
      },
    ]
  },
  {
    path: 'locaties',
    component: LocationOverviewPageComponent,
    canActivate: [AuthGuardWithForcedLogin]
  },
  {
    path: 'locaties/create',
    component: LocationCreatePageComponent,
    canActivate: [AuthGuardWithForcedLogin, AuthGuardRole],
    data: {
      role: Role.CreateFishingPoint
    }
  },
  {path: 'locaties/:code', component: LocationDetailComponent, canActivate: [AuthGuardWithForcedLogin]},
  {path: 'vissoorten', component: FishSpeciesOverviewPageComponent, canActivate: [AuthGuardWithForcedLogin]},
  {path: 'vissoorten/:taxonId', component: FishSpeciesDetailPageComponent, canActivate: [AuthGuardWithForcedLogin]},
  {path: 'methoden', component: MethodsOverviewPageComponent, canActivate: [AuthGuardWithForcedLogin]},
  {path: 'waarnemingen', component: SurveyEventsOverviewPageComponent, canActivate: [AuthGuardWithForcedLogin]},
  {path: 'profiel', component: ProfilePageComponent, canActivate: [AuthGuardWithForcedLogin]},
  {
    path: 'gebruikers',
    component: UsersPageComponent,
    canActivate: [AuthGuardWithForcedLogin, AuthGuardRole],
    data: {
      role: Role.UserAdmin
    }
  },
  {
    path: 'tips/:tipPage', component: TipsComponent,
    children: [
      {
        path: '',
        component: TipsPageComponent,
        canActivate: [AuthGuardWithForcedLogin],
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'instellingen',
    component: SettingsComponent,
    canActivateChild: [ChildRoleGuard],
    data: {roles: [Role.UserAdmin]},
    children: [
      {
        path: 'gebruikers',
        component: UsersPageComponent,
        canActivate: [AuthGuardWithForcedLogin]
      },
      {
        path: 'instanties',
        component: InstancesPageComponent,
        canActivate: [AuthGuardWithForcedLogin]
      },
      {
        path: 'teams',
        component: TeamsPageComponent,
        canActivate: [AuthGuardWithForcedLogin]
      }
    ]
  },
  {
    path: 'importeren',
    component: ImportsOverviewComponent,
    canActivateChild: [AuthGuardWithForcedLogin]
  },
  {
    path: 'importeren/verwerkt',
    component: ImportsOverviewProcessedComponent,
    canActivateChild: [AuthGuardWithForcedLogin]
  },
  {
    path: 'importeren/:id',
    component: ImportsDetailComponent,
    canActivateChild: [AuthGuardWithForcedLogin]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisRoutingModule {
}

import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Project} from '../../../domain/project/project';
import {Observable, Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {SurveyEvent} from '../../../domain/survey-event/surveyEvent';
import {map, switchMap} from 'rxjs/operators';
import {SurveyEventsService} from '../../../services/vis.surveyevents.service';
import {ProjectService} from '../../../services/vis.project.service';
import {FishingPoint} from '../../../domain/location/fishing-point';
import {LocationsService} from '../../../services/vis.locations.service';
import {SurveyEventCopyModalComponent} from '../survey-event-copy-modal/survey-event-copy-modal.component';
import {Role} from '../../../core/_models/role';

@Component({
  selector: 'app-survey-event-heading',
  templateUrl: './survey-event-heading.component.html'
})
export class SurveyEventHeadingComponent implements OnInit, OnDestroy {

  @ViewChild(SurveyEventCopyModalComponent) surveyEventCopyModal: SurveyEventCopyModalComponent;

  public role = Role;

  project: Project;
  projectCode: string;
  surveyEventId: number;

  surveyEvent$: Observable<SurveyEvent>;
  surveyEventMethodCode$: Observable<string>;
  surveyEventOccurrence$: Observable<Date>;

  fishingPoint$: Observable<FishingPoint>;
  private subscription = new Subscription();

  constructor(private projectService: ProjectService, private surveyEventsService: SurveyEventsService,
              private activatedRoute: ActivatedRoute, private locationsService: LocationsService) {
    this.projectCode = this.activatedRoute.snapshot.params.projectCode;
    this.surveyEventId = this.activatedRoute.snapshot.params.surveyEventId;
    this.subscription.add(
      this.projectService.getProject(this.activatedRoute.snapshot.params.projectCode).subscribe(value => {
        this.project = value;
      })
    );

    this.surveyEvent$ = this.surveyEventsService.getSurveyEvent(this.activatedRoute.snapshot.params.projectCode,
      this.activatedRoute.snapshot.params.surveyEventId);
    this.surveyEventMethodCode$ = this.surveyEvent$.pipe(map(surveyEvent => surveyEvent.method), map(code => 'method.' + code));
    this.surveyEventOccurrence$ = this.surveyEvent$.pipe(map(surveyEvent => surveyEvent.occurrence));
    this.fishingPoint$ = this.surveyEvent$.pipe(switchMap((surveyEvent) =>
      this.locationsService.findById(surveyEvent.fishingPoint?.id)));
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  showCreateMeasurementsButton() {
    return !window.location.pathname.endsWith('metingen/toevoegen');
  }

  copySurveyEvent() {
    this.surveyEventCopyModal.open();
  }
}

import {Component, OnDestroy, OnInit} from '@angular/core';
import {Project} from '../../../domain/project/project';
import {Observable, Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {SurveyEvent} from '../../../domain/survey-event/surveyEvent';
import {map, switchMap} from 'rxjs/operators';
import {SurveyEventsService} from '../../../services/vis.surveyevents.service';
import {ProjectService} from '../../../services/vis.project.service';
import {FishingPoint} from '../../../domain/location/fishing-point';
import {LocationsService} from '../../../services/vis.locations.service';

@Component({
  selector: 'app-survey-event-heading',
  templateUrl: './survey-event-heading.component.html'
})
export class SurveyEventHeadingComponent implements OnInit, OnDestroy {

  project: Project;

  private subscription = new Subscription();
  surveyEvent$: Observable<SurveyEvent>;
  surveyEventMethodCode$: Observable<string>;
  surveyEventOccurrence$: Observable<Date>;
  fishingPoint$: Observable<FishingPoint>;

  constructor(private projectService: ProjectService, private surveyEventsService: SurveyEventsService,
              private activatedRoute: ActivatedRoute, private locationsService: LocationsService) {
    this.subscription.add(
      this.projectService.getProject(this.activatedRoute.snapshot.params.projectCode).subscribe(value => {
        this.project = value;
      })
    );

    this.surveyEvent$ = this.surveyEventsService.getSurveyEvent(this.activatedRoute.snapshot.params.projectCode,
      this.activatedRoute.snapshot.params.surveyEventId);
    this.surveyEventMethodCode$ = this.surveyEvent$.pipe(map(surveyEvent => surveyEvent.method), map(code => 'method.' + code));
    this.surveyEventOccurrence$ = this.surveyEvent$.pipe(map(surveyEvent => surveyEvent.occurrence));
    this.fishingPoint$ = this.surveyEvent$.pipe(switchMap((surveyEvent) => this.locationsService.findById(surveyEvent.fishingPoint?.id)));
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  showCreateMeasurementsButton() {
    return !window.location.pathname.endsWith('metingen/toevoegen');
  }
}

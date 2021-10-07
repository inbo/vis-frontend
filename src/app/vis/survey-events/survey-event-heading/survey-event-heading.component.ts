import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Project} from '../../../domain/project/project';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {SurveyEvent, SurveyEventOverview} from '../../../domain/survey-event/surveyEvent';
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

  surveyEvent: SurveyEvent;
  fishingPoint: FishingPoint;

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

    this.surveyEventsService.getSurveyEvent(this.activatedRoute.snapshot.params.projectCode,
      this.activatedRoute.snapshot.params.surveyEventId).subscribe(value => {
      this.surveyEvent = value;
      this.locationsService.findById(this.surveyEvent.fishingPoint?.id).subscribe(value1 => {
        this.fishingPoint = value1;
      });
    });
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

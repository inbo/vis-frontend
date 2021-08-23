import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {AsyncPage} from '../../../shared-ui/paging-async/asyncPage';
import {Measurement} from '../../../domain/survey-event/measurement';
import {Observable, of} from 'rxjs';
import {SurveyEventsService} from '../../../services/vis.surveyevents.service';
import {take} from 'rxjs/operators';
import {SurveyEvent} from '../../../domain/survey-event/surveyEvent';
import {Role} from '../../../core/_models/role';
import {AuthService} from '../../../core/auth.service';
import {faRulerHorizontal, faWeightHanging} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-survey-event-measurements-page',
  templateUrl: './survey-event-measurements-page.component.html'
})
export class SurveyEventMeasurementsPageComponent implements OnInit {
  faRulerHorizontal = faRulerHorizontal;
  faWeightHanging = faWeightHanging;

  public role = Role;

  projectCode: any;
  surveyEventId: any;

  isModalOpen = false;
  loading = false;
  measurementToBeDeleted: Measurement;
  pager: AsyncPage<Measurement>;
  measurements: Observable<Measurement[]>;

  surveyEvent: SurveyEvent;

  constructor(private titleService: Title, private surveyEventsService: SurveyEventsService, private activatedRoute: ActivatedRoute,
              public authService: AuthService) {
    this.surveyEventId = this.activatedRoute.parent.snapshot.params.surveyEventId;
    this.projectCode = this.activatedRoute.parent.snapshot.params.projectCode;
    this.titleService.setTitle('Waarneming metingen ' + this.activatedRoute.parent.snapshot.params.surveyEventId);
  }

  ngOnInit(): void {
    this.init();
  }

  private init() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.loadMeasurements(params.page ? params.page : 1, params.size ? params.size : 20);
    });

    this.surveyEventsService.getSurveyEvent(this.activatedRoute.parent.snapshot.params.projectCode,
      this.activatedRoute.parent.snapshot.params.surveyEventId)
      .pipe(take(1))
      .subscribe(value => this.surveyEvent = value);
  }

  loadMeasurements(page: number, size: number) {
    this.loading = true;
    this.measurements = of([]);
    this.surveyEventsService.getMeasurements(this.projectCode, this.surveyEventId, page, size).subscribe((value) => {
      this.pager = value;
      this.measurements = of(value.content);
      this.loading = false;
    });
  }

  deleteClicked(measurement: Measurement) {
    this.measurementToBeDeleted = measurement;
    this.isModalOpen = true;
  }

  cancelModal() {
    this.isModalOpen = false;
  }

  confirmClicked() {
    this.surveyEventsService.deleteMeasurement(this.projectCode, this.surveyEventId, this.measurementToBeDeleted.measurementId.value)
      .pipe(take(1))
      .subscribe(() => {
        this.init();
        this.cancelModal();
      });
  }
}

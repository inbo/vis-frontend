import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {AsyncPage} from '../../../shared-ui/paging-async/asyncPage';
import {Measurement} from '../../../domain/survey-event/measurement';
import {Observable, of} from 'rxjs';
import {SurveyEventsService} from '../../../services/vis.surveyevents.service';

@Component({
  selector: 'app-survey-event-measurements-page',
  templateUrl: './survey-event-measurements-page.component.html'
})
export class SurveyEventMeasurementsPageComponent implements OnInit {

  projectCode: any;
  surveyEventId: any;

  loading = false;
  pager: AsyncPage<Measurement>;
  measurements: Observable<Measurement[]>;

  constructor(private titleService: Title, private surveyEventsService: SurveyEventsService, private activatedRoute: ActivatedRoute) {
    this.surveyEventId = this.activatedRoute.parent.snapshot.params.surveyEventId;
    this.projectCode = this.activatedRoute.parent.snapshot.params.projectCode;
    this.titleService.setTitle('Waarneming metingen ' + this.activatedRoute.parent.snapshot.params.surveyEventId);
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.loadMeasurements(params.page ? params.page : 1, params.size ? params.size : 20);
    });
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

}

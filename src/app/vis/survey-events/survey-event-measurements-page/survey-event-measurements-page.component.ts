import {Component, OnInit} from '@angular/core';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {BreadcrumbLink} from '../../../shared-ui/breadcrumb/BreadcrumbLinks';
import {Title} from '@angular/platform-browser';
import {VisService} from '../../../vis.service';
import {ActivatedRoute} from '@angular/router';
import {AsyncPage} from '../../../shared-ui/paging-async/asyncPage';
import {Measurement} from '../../project/model/measurement';
import {Observable, of} from 'rxjs';

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

  constructor(private titleService: Title, private visService: VisService, private activatedRoute: ActivatedRoute) {
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
    this.visService.getMeasurements(this.projectCode, this.surveyEventId, page, size).subscribe((value) => {
      this.pager = value;
      this.measurements = of(value.content);
      this.loading = false;
    });
  }

}

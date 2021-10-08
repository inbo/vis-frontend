import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SurveyEventsService} from '../../../services/vis.surveyevents.service';
import {SurveyEventParameters, TaxonCpue} from '../../../domain/survey-event/surveyEvent';
import {Role} from '../../../core/_models/role';

@Component({
  selector: 'app-survey-event-cpue-page',
  templateUrl: './survey-event-cpue-page.component.html'
})
export class SurveyEventCpuePageComponent implements OnInit {
  role = Role;

  parameters: SurveyEventParameters;
  taxaCpue: TaxonCpue[];

  constructor(private surveyEventsService: SurveyEventsService, private activatedRoute: ActivatedRoute) {
  }

  projectCode = this.activatedRoute.snapshot.parent.params.projectCode;
  surveyEventId = this.activatedRoute.snapshot.parent.params.surveyEventId;

  private taxaCpue$ = this.surveyEventsService.findTaxaCpueForSurveyEvent(
    this.projectCode,
    this.surveyEventId
  );

  private parameters$ = this.surveyEventsService.surveyEventParameters(
    this.projectCode,
    this.surveyEventId
  );

  ngOnInit(): void {
    this.taxaCpue$.subscribe(value => {
      this.taxaCpue = value;
    });

    this.parameters$.subscribe(value => {
      this.parameters = value;
    });
  }

  recalculateCpue() {
    this.surveyEventsService.recalculateCpue(
      this.projectCode,
      this.surveyEventId
    ).subscribe(_ => {
      this.taxaCpue$.subscribe(value => {
        this.taxaCpue = value;
      });
    });
  }
}

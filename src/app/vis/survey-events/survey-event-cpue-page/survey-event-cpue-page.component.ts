import {Component, OnInit} from '@angular/core';
import {CpueService} from '../../../services/vis.cpue.service';
import {ActivatedRoute} from '@angular/router';
import {SurveyEventsService} from '../../../services/vis.surveyevents.service';
import {CpueParameters} from '../../../domain/survey-event/surveyEvent';
import {Role} from '../../../core/_models/role';

@Component({
  selector: 'app-survey-event-cpue-page',
  templateUrl: './survey-event-cpue-page.component.html'
})
export class SurveyEventCpuePageComponent implements OnInit {
  role = Role;
  parameters: CpueParameters;

  constructor(private surveyEventsService: SurveyEventsService, private activatedRoute: ActivatedRoute) {
  }

  projectCode = this.activatedRoute.snapshot.parent.params.projectCode;
  surveyEventId = this.activatedRoute.snapshot.parent.params.surveyEventId;

  ngOnInit(): void {
    const cpue$ = this.surveyEventsService.cpueParameters(
      this.projectCode,
      this.surveyEventId
    );

    cpue$.subscribe(value => {
      this.parameters = value;
    });
  }

}

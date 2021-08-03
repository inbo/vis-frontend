import {Component, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {Parameters} from '../../../domain/survey-event/parameters';
import {Observable, Subscription} from 'rxjs';
import {SurveyEventsService} from '../../../services/vis.surveyevents.service';
import {SurveyEvent} from '../../../domain/survey-event/surveyEvent';

@Component({
  selector: 'app-survey-event-parameters-page',
  templateUrl: './survey-event-parameters-page.component.html'
})
export class SurveyEventParametersPageComponent implements OnInit, OnDestroy {

  projectCode: string;
  surveyEventId: any;
  parameters: Parameters;

  surveyEvent$: Observable<SurveyEvent>;

  private subscription = new Subscription();

  constructor(private titleService: Title, private surveyEventsService: SurveyEventsService, private activatedRoute: ActivatedRoute,
              private surveyEventService: SurveyEventsService) {
    this.projectCode = this.activatedRoute.parent.snapshot.params.projectCode;
    this.surveyEventId = this.activatedRoute.parent.snapshot.params.surveyEventId;
    this.titleService.setTitle('Waarneming waterkwaliteitsparameters ' + this.activatedRoute.parent.snapshot.params.surveyEventId);

    this.surveyEvent$ = this.surveyEventService.getSurveyEvent(this.activatedRoute.parent.snapshot.params.projectCode,
      this.activatedRoute.parent.snapshot.params.surveyEventId);

    this.subscription.add(this.surveyEventsService.getParameters(this.activatedRoute.parent.snapshot.params.projectCode,
      this.activatedRoute.parent.snapshot.params.surveyEventId).subscribe(value => {
      this.parameters = value;
    }));
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

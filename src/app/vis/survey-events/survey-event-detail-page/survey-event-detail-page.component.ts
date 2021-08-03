import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {SurveyEventsService} from '../../../services/vis.surveyevents.service';
import {SurveyEvent} from '../../../domain/survey-event/surveyEvent';
import {Observable} from 'rxjs';
import {Role} from '../../../core/_models/role';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-survey-event-detail-page',
  templateUrl: './survey-event-detail-page.component.html'
})

export class SurveyEventDetailPageComponent implements OnInit {
  role = Role;
  surveyEvent$: Observable<SurveyEvent>;

  constructor(private titleService: Title, private activatedRoute: ActivatedRoute, private surveyEventService: SurveyEventsService) {
    this.titleService.setTitle(`Waarneming algemeen ${this.activatedRoute.parent.snapshot.params.surveyEventId}`);
    this.surveyEvent$ = this.surveyEventService.getSurveyEvent(this.activatedRoute.parent.snapshot.params.projectCode,
      this.activatedRoute.parent.snapshot.params.surveyEventId);
  }

  ngOnInit(): void {
  }

  reOpenSurveyEvent() {
    this.surveyEventService.reOpenSurveyEvent(this.activatedRoute.snapshot.params.projectCode,
      this.activatedRoute.parent.snapshot.params.surveyEventId)
      .pipe(take(1))
      .subscribe(() => window.location.reload());
  }
}

import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {SurveyEventsService} from '../../../services/vis.surveyevents.service';
import {SurveyEvent} from '../../../domain/survey-event/surveyEvent';
import {Role} from '../../../core/_models/role';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-survey-event-detail-page',
  templateUrl: './survey-event-detail-page.component.html'
})

export class SurveyEventDetailPageComponent implements OnInit {
  role = Role;
  surveyEvent: SurveyEvent;

  constructor(private titleService: Title, private activatedRoute: ActivatedRoute, private surveyEventService: SurveyEventsService) {
    this.titleService.setTitle(`Waarneming algemeen ${this.activatedRoute.parent.snapshot.params.surveyEventId}`);
    this.loadSurveyEvent();
  }

  private loadSurveyEvent() {
    this.surveyEventService.getSurveyEvent(this.activatedRoute.parent.snapshot.params.projectCode,
      this.activatedRoute.parent.snapshot.params.surveyEventId).subscribe(value => this.surveyEvent = value);
  }

  ngOnInit(): void {
  }

  reOpenSurveyEvent() {
    this.surveyEventService.reOpenSurveyEvent(this.activatedRoute.snapshot.params.projectCode,
      this.activatedRoute.parent.snapshot.params.surveyEventId)
      .pipe(take(1))
      .subscribe(() => this.loadSurveyEvent());
  }

  validateSurveyEvent() {
    this.surveyEventService.validateSurveyEvent(this.activatedRoute.snapshot.params.projectCode,
      this.activatedRoute.parent.snapshot.params.surveyEventId)
      .pipe(take(1))
      .subscribe(() => this.loadSurveyEvent());
  }

  deleteSurveyEvent() {
    this.surveyEventService.deleteSurveyEvent(this.activatedRoute.parent.snapshot.params.projectCode,
      this.activatedRoute.parent.snapshot.params.surveyEventId)
      .pipe(take(1))
      .subscribe(() => this.loadSurveyEvent());
  }

  canValidateSurveyEvent() {
    return this.surveyEvent?.status === 'ENTERED';
  }

  canRestoreSurveyEvent() {
    return this.surveyEvent?.status === 'DELETED' || this.surveyEvent?.status === 'VALID';
  }

  canDeleteSurveyEvent() {
    return this.surveyEvent?.status === 'ENTERED';
  }
}

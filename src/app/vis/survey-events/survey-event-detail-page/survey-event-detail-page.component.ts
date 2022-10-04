import {Component, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {SurveyEventsService} from '../../../services/vis.surveyevents.service';
import {SurveyEvent} from '../../../domain/survey-event/surveyEvent';
import {Role} from '../../../core/_models/role';
import {switchMap, take, takeUntil, tap} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-survey-event-detail-page',
    templateUrl: './survey-event-detail-page.component.html',
})

export class SurveyEventDetailPageComponent implements OnInit, OnDestroy {

    role = Role;
    surveyEvent: SurveyEvent;
    isModalOpen = false;
    projectCode: string;
    private readonly destroy = new Subject<void>();

    constructor(private titleService: Title, private activatedRoute: ActivatedRoute, private surveyEventService: SurveyEventsService) {
    }

    ngOnInit(): void {
        this.titleService.setTitle(`Waarneming algemeen ${this.activatedRoute.parent.snapshot.params.surveyEventId}`);
        this.loadSurveyEvent();
    }

    ngOnDestroy() {
        this.destroy.next(undefined);
    }

    reopenSurveyEvent() {
        this.surveyEventService.reOpenSurveyEvent(this.activatedRoute.snapshot.params.projectCode,
            this.activatedRoute.parent.snapshot.params.surveyEventId)
            .pipe(take(1))
            .subscribe(() => location.reload());
    }

    validateSurveyEvent() {
        this.surveyEventService.validateSurveyEvent(this.activatedRoute.snapshot.params.projectCode,
            this.activatedRoute.parent.snapshot.params.surveyEventId)
            .pipe(take(1))
            .subscribe(() => location.reload());
    }

    deleteSurveyEvent() {
        this.isModalOpen = true;
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

    cancelModal() {
        this.isModalOpen = false;
    }

    confirmClicked() {
        this.surveyEventService.deleteSurveyEvent(this.activatedRoute.parent.snapshot.params.projectCode,
            this.activatedRoute.parent.snapshot.params.surveyEventId)
            .pipe(take(1))
            .subscribe(() => {
                this.cancelModal();
                this.loadSurveyEvent();
            });
    }

    private loadSurveyEvent() {
        this.activatedRoute.params
            .pipe(
                takeUntil(this.destroy.asObservable()),
                tap(params => this.projectCode = params.projectCode),
                switchMap(params => this.surveyEventService.getSurveyEvent(this.projectCode, params.surveyEventId)),
            )
            .subscribe(value => this.surveyEvent = value);
    }
}

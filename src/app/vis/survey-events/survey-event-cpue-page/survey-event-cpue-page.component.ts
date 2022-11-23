import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SurveyEventsService} from '../../../services/vis.surveyevents.service';
import {SurveyEvent, SurveyEventCpueParameter, SurveyEventParameters, TaxonCpue} from '../../../domain/survey-event/surveyEvent';
import {Role} from '../../../core/_models/role';

@Component({
    selector: 'app-survey-event-cpue-page',
    templateUrl: './survey-event-cpue-page.component.html',
})
export class SurveyEventCpuePageComponent implements OnInit {

    role = Role;

    parameters: SurveyEventParameters;
    processedParameters: Array<SurveyEventCpueParameter> = [];
    taxaCpue: TaxonCpue[];
    surveyEvent: SurveyEvent;

    constructor(private surveyEventsService: SurveyEventsService,
                private activatedRoute: ActivatedRoute) {
    }

    projectCode = this.activatedRoute.snapshot.parent.params.projectCode;
    surveyEventId = this.activatedRoute.snapshot.parent.params.surveyEventId;

    private taxaCpue$ = this.surveyEventsService.findTaxaCpueForSurveyEvent(
        this.projectCode,
        this.surveyEventId,
    );

    private parameters$ = this.surveyEventsService.surveyEventParameters(
        this.projectCode,
        this.surveyEventId,
    );

    ngOnInit(): void {
        this.surveyEventsService
            .getSurveyEvent(this.projectCode, this.surveyEventId)
            .subscribe(survey => this.surveyEvent = survey);
        this.taxaCpue$.subscribe(value => {
            this.taxaCpue = value;
        });

        this.parameters$.subscribe(value => {
            this.parameters = value;
            this.processedParameters = this.surveyEventsService.flattenParams(value.parameters);
            const paramsOrder = this.surveyEventsService.getCpueParamOrderForMethod(this.surveyEvent.method);
            if (paramsOrder) {
                console.log(paramsOrder);
                this.processedParameters.sort((a, b) => paramsOrder.indexOf(a.key) - paramsOrder.indexOf(b.key));
                console.log(this.processedParameters);
            }
        });
    }

    recalculateCpue() {
        this.surveyEventsService.recalculateCpue(
            this.projectCode,
            this.surveyEventId,
        ).subscribe(_ => {
            this.taxaCpue$.subscribe(value => {
                this.taxaCpue = value;
            });
        });
    }
}

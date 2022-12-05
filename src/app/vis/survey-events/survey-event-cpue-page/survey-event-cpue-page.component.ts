import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SurveyEventsService} from '../../../services/vis.surveyevents.service';
import {SurveyEvent, SurveyEventCpueParameter, SurveyEventParameters, TaxonCpue} from '../../../domain/survey-event/surveyEvent';
import {Role} from '../../../core/_models/role';
import {forkJoin} from 'rxjs';

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
        this.taxaCpue$.subscribe(value => {
            this.taxaCpue = value;
        });

        forkJoin([
            this.parameters$,
            this.surveyEventsService.getSurveyEvent(this.projectCode, this.surveyEventId),
        ])
            .subscribe(([parameters, surveyEvent]) => {
                this.surveyEvent = surveyEvent;
                this.parameters = parameters;
                this.processedParameters = this.surveyEventsService.flattenParams(parameters.parameters);
                const paramsOrder = this.surveyEventsService.getCpueParamOrderForMethod(this.surveyEvent.method);
                if (paramsOrder) {
                    this.processedParameters.sort((a, b) => paramsOrder.indexOf(a.key) - paramsOrder.indexOf(b.key));
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

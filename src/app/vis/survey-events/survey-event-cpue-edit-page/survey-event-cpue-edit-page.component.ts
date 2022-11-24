import {Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HasUnsavedData} from '../../../core/core.interface';
import {Role} from '../../../core/_models/role';
import {FormBuilder, NgForm} from '@angular/forms';
import {SurveyEventCpueParameter, SurveyEventOverview} from '../../../domain/survey-event/surveyEvent';
import {SearchableSelectOption} from '../../../shared-ui/searchable-select/SearchableSelectOption';
import {SurveyEventsService} from '../../../services/vis.surveyevents.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LocationsService} from '../../../services/vis.locations.service';
import {MethodsService} from '../../../services/vis.methods.service';
import {Location} from '@angular/common';
import {take, tap} from 'rxjs/operators';
import {Method} from '../../../domain/method/method';
import {Subject} from 'rxjs';
import {groupBy, isNil, uniqBy} from 'lodash-es';

@Component({
    selector: 'app-survey-event-cpue-edit-page',
    templateUrl: './survey-event-cpue-edit-page.component.html',
})
export class SurveyEventCpueEditPageComponent implements OnInit, HasUnsavedData, OnDestroy {

    @ViewChild('cpueParamsForm') paramsForm: NgForm;

    public role = Role;
    private readonly destroy = new Subject<void>();

    submitted = false;
    surveyEvent: SurveyEventOverview;
    methods: SearchableSelectOption<Method>[] = [];
    parameters: Array<SurveyEventCpueParameter> = [];

    constructor(private surveyEventService: SurveyEventsService,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private formBuilder: FormBuilder,
                private locationsService: LocationsService,
                private methodsService: MethodsService,
                private _location: Location,
                private surveyEventsService: SurveyEventsService) {
    }

    private projectCode = this.activatedRoute.parent.snapshot.params.projectCode;
    private surveyEventId = this.activatedRoute.parent.snapshot.params.surveyEventId;

    ngOnInit(): void {
        this.surveyEventsService
            .surveyEventParameters(
                this.projectCode,
                this.surveyEventId,
            )
            .pipe(
                take(1),
                tap(parameters => {
                    this.parameters = this.surveyEventsService.flattenParams(parameters.parameters);
                    const paramsOrder = this.surveyEventsService.getCpueParamOrderForMethod(this.surveyEvent.method);
                    if (paramsOrder) {
                        this.parameters = this.parameters.sort((a, b) => paramsOrder.indexOf(a.key) - paramsOrder.indexOf(b.key));
                    }
                }),
            )
            .subscribe();

    }

    ngOnDestroy() {
        this.destroy.next();
        this.destroy.complete();
    }

    saveSurveyEvent() {
        this.submitted = true;

        const requestDTO = {};
        this.parameters.forEach(param => requestDTO[param.key] = param.value);
        this.surveyEventService
            .updateCpueParameters(this.projectCode, this.surveyEventId, requestDTO)
            .pipe(take(1))
            .subscribe(() => {
                this.router.navigate(['projecten', this.projectCode, 'waarnemingen', this.surveyEventId, 'cpue']);
            });
    }

    hasUnsavedData(): boolean {
        return this.paramsForm?.dirty && !this.submitted;
    }

    @HostListener('window:beforeunload')
    hasUnsavedDataBeforeUnload(): any {
        // Return false when there is unsaved data to show a dialog
        return !this.hasUnsavedData();
    }

    cancel() {
        this._location.back();
    }

    parameterUpdated(changedParameter: SurveyEventCpueParameter): void {
        const parentparamsForChangedParameter = this.parameters.filter(param => param.calculation?.includes(changedParameter.key));
        if (parentparamsForChangedParameter.length === 0) {
            return;
        }
        parentparamsForChangedParameter.forEach(parentParam => {
            const allChildParamsForParentParam = this.parameters.filter(param => parentParam.calculation.includes(param.key));
            if (allChildParamsForParentParam.some(childParam => isNil(childParam.value))) {
                return;
            }

            let calculation = parentParam.calculation;
            allChildParamsForParentParam.forEach(subparam => {
                const regex = new RegExp(subparam.key, 'g');
                calculation = calculation.replace(regex, `${subparam.value}`);
            });

            parentParam.value = Math.round(eval(calculation) * 1000) / 1000;
            this.parameterUpdated(parentParam);
        });
    }
}


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
import {groupBy} from 'lodash-es';

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
                    this.parameters = [];
                    const parametersGroupedByParentId = groupBy(parameters.parameters, 'parentId');
                    const parentParams = parameters.parameters.filter(param => param.parentId == null);
                    delete parametersGroupedByParentId.null;
                    parentParams.forEach(parentParam => {
                        console.log(parametersGroupedByParentId);
                        this.parameters.push(parentParam, ...(parametersGroupedByParentId[parentParam.id] || []));
                    });

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

        const formData = {};
        this.parameters.forEach(parameter => formData[parameter.key] = parameter.value);

        this.surveyEventService
            .updateCpueParameters(this.projectCode, this.surveyEventId, formData)
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
        if (!changedParameter.parentId) {
            return;
        }
        const parentParameter = this.parameters.find(param => param.id === changedParameter.parentId);
        const subparameters = this.parameters.filter(param => param.parentId === parentParameter.id);
        parentParameter.value = this.surveyEventsService.calculateCPUESubparameter(parentParameter, subparameters).value;
    }
}


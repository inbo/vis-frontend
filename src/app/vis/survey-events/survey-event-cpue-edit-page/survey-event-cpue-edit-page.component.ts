import {Component, HostListener, OnInit} from '@angular/core';
import {HasUnsavedData} from '../../../core/core.interface';
import {Role} from '../../../core/_models/role';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {SurveyEventOverview} from '../../../domain/survey-event/surveyEvent';
import {SearchableSelectOption} from '../../../shared-ui/searchable-select/SearchableSelectOption';
import {SurveyEventsService} from '../../../services/vis.surveyevents.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LocationsService} from '../../../services/vis.locations.service';
import {MethodsService} from '../../../services/vis.methods.service';
import {Location} from '@angular/common';
import {take} from 'rxjs/operators';
import {Method} from '../../../domain/method/method';

@Component({
    selector: 'app-survey-event-cpue-edit-page',
    templateUrl: './survey-event-cpue-edit-page.component.html',
})
export class SurveyEventCpueEditPageComponent implements OnInit, HasUnsavedData {

    public role = Role;

    surveyEventForm: FormGroup = new FormGroup({});
    submitted = false;
    surveyEvent: SurveyEventOverview;
    methods: SearchableSelectOption<Method>[] = [];

    constructor(private surveyEventService: SurveyEventsService, private activatedRoute: ActivatedRoute,
                private router: Router, private formBuilder: FormBuilder, private locationsService: LocationsService,
                private methodsService: MethodsService, private _location: Location, private surveyEventsService: SurveyEventsService) {
    }

    private projectCode = this.activatedRoute.parent.snapshot.params.projectCode;

    private surveyEventId = this.activatedRoute.parent.snapshot.params.surveyEventId;

    ngOnInit(): void {
        const parameters$ = this.surveyEventsService.surveyEventParameters(
            this.projectCode,
            this.surveyEventId,
        );

        parameters$.subscribe(dto => {
            this.surveyEventForm = new FormGroup({});

            for (const parameter of dto.parameters) {
                this.surveyEventForm.addControl(parameter.key, new FormControl({
                    value: parameter.value,
                    disabled: parameter.automatic,
                }));
            }
        });

    }

    saveSurveyEvent() {
        this.submitted = true;

        if (this.surveyEventForm.invalid) {
            return;
        }

        const formData = this.surveyEventForm.getRawValue();
        formData.fishingPointId = formData.location;
        delete formData.location;

        this.surveyEventService
            .updateCpueParameters(this.projectCode, this.surveyEventId, formData)
            .pipe(take(1))
            .subscribe(() => {
                this.router.navigate(['projecten', this.projectCode, 'waarnemingen', this.surveyEventId, 'cpue']).then();
            });
    }

    hasUnsavedData(): boolean {
        return this.surveyEventForm.dirty && !this.submitted;
    }

    @HostListener('window:beforeunload')
    hasUnsavedDataBeforeUnload(): any {
        // Return false when there is unsaved data to show a dialog
        return !this.hasUnsavedData();
    }

    cancel() {
        this._location.back();
    }

    controls() {
        return Object.keys(this.surveyEventForm?.controls);
    }
}


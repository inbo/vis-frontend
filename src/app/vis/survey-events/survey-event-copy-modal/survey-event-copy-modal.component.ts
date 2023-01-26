import {Component, Input, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {SurveyEventsService} from '../../../services/vis.surveyevents.service';
import {take, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {uniqueNewValidator} from '../survey-event-validators';
import {SearchableSelectOption} from '../../../shared-ui/searchable-select/SearchableSelectOption';
import {Method} from '../../../domain/method/method';
import {MethodsService} from '../../../services/vis.methods.service';
import {SearchableSelectConfigBuilder} from '../../../shared-ui/searchable-select/SearchableSelectConfig';
import {LocationsService} from '../../../services/vis.locations.service';
import {Project} from '../../../domain/project/project';

@Component({
    selector: 'app-survey-event-copy-modal',
    templateUrl: './survey-event-copy-modal.component.html',
})
export class SurveyEventCopyModalComponent implements OnInit {

    @Input() project: Project;
    @Input() surveyEventId: number;
    @Input() startDate: Date;
    @Input() endDate: Date;
    @Input() fishingPointId: number;
    @Input() method: string;

    isOpen = false;
    copySurveyEventForm: UntypedFormGroup;
    submitted = false;

    allMethods: Array<Method> = [];
    filteredMethods: SearchableSelectOption<string>[] = [];
    fishingPointCodes: SearchableSelectOption<number>[] = [];
    methodSearchConfiguration = new SearchableSelectConfigBuilder()
        .minQueryLength(0)
        .searchPlaceholder('')
        .build();
    fishingPointSearchableSelectConfig = new SearchableSelectConfigBuilder()
        .minQueryLength(2)
        .searchPlaceholder('Minstens 2 karakters...')
        .build();
    minDate: Date;
    maxDate: Date;

    constructor(private formBuilder: UntypedFormBuilder,
                private surveyEventsService: SurveyEventsService,
                private router: Router,
                private methodsService: MethodsService,
                private locationsService: LocationsService) {
    }

    ngOnInit(): void {
        if (!this.project?.projectId || !this.surveyEventId) {
            throw new Error('Attributes "projectCode" and "surveyEventId" are required');
        }

        this.getAllMethods();
        this.getFishingPointCodes(undefined, this.fishingPointId);

        this.minDate = new Date(this.startDate);
        this.maxDate = this.endDate ? new Date(this.endDate) > new Date() ? new Date() : new Date(this.endDate) : new Date();
        this.copySurveyEventForm = this.formBuilder.group(
            {
                occurrenceDate: [new Date(), [Validators.required]],
                method: [this.method],
                fishingPointId: [this.fishingPointId],
            }, {asyncValidators: [uniqueNewValidator(this.project.projectId, this.surveyEventsService)]});
        this.copySurveyEventForm.updateValueAndValidity();
    }

    open() {
        this.isOpen = true;
    }

    get occurrenceDate() {
        return this.copySurveyEventForm.get('occurrenceDate');
    }

    copySurveyEvent() {
        this.submitted = true;

        if (this.copySurveyEventForm.invalid) {
            return;
        }

        this.surveyEventsService.copySurveyEvent(this.project.code.value, this.surveyEventId, this.copySurveyEventForm.getRawValue())
            .pipe(take(1))
            .subscribe(newSurveyEvent => {
                this.isOpen = false;
                this.router.navigate(['projecten', newSurveyEvent.projectCode,
                    'waarnemingen', newSurveyEvent.surveyEventId]);
            });
    }

    private getAllMethods(): void {
        this.methodsService.getAllMethods()
            .pipe(
                take(1),
                tap(methods => this.allMethods = methods),
                tap(() => this.filterMethods('')),
            ).subscribe();
    }

    filterMethods(query: string): void {
        query = query.toLowerCase();
        this.filteredMethods = this.allMethods
            .filter(method =>
                method.code.toLowerCase().includes(query)
                || method.description.toLowerCase().includes(query))
            .map(method => ({
                displayValue: `${method.code} - ${method.description}`,
                value: method.code,
            }));
    }

    getFishingPointCodes(searchTerm: string, id?: number) {
        this.locationsService
            .searchFishingPoints(searchTerm, id)
            .pipe(take(1))
            .subscribe(fishingPointSearchResults =>
                this.fishingPointCodes = fishingPointSearchResults
                    .map(fishingPointCode => ({
                        displayValue: fishingPointCode.code,
                        value: fishingPointCode.id,
                    })));
    }
}

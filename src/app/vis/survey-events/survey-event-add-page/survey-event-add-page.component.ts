import {Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SearchableSelectOption} from '../../../shared-ui/searchable-select/SearchableSelectOption';
import {SurveyEventsService} from '../../../services/vis.surveyevents.service';
import {ActivatedRoute, Router} from '@angular/router';
import {LocationsService} from '../../../services/vis.locations.service';
import {MethodsService} from '../../../services/vis.methods.service';
import {debounceTime, filter, map, switchMap, take, tap} from 'rxjs/operators';
import {Method} from '../../../domain/method/method';
import {Location} from '@angular/common';
import {HasUnsavedData} from '../../../core/core.interface';
import {ProjectService} from '../../../services/vis.project.service';
import {DatepickerComponent} from '../../../shared-ui/datepicker/datepicker.component';
import {uniqueNewValidator} from '../survey-event-validators';
import {SearchableSelectConfig, SearchableSelectConfigBuilder} from '../../../shared-ui/searchable-select/SearchableSelectConfig';
import {of, Subscription} from 'rxjs';
import {startOfDay} from 'date-fns';
import {SurveyEvent} from '../../../domain/survey-event/surveyEvent';

@Component({
    selector: 'app-survey-event-add-page',
    templateUrl: './survey-event-add-page.component.html',
})
export class SurveyEventAddPageComponent implements OnInit, HasUnsavedData, OnDestroy {

    @ViewChild(DatepickerComponent) datepicker: DatepickerComponent;

    createSurveyEventForm: FormGroup;
    isOpen = false;
    submitted = false;

    fishingPoints: SearchableSelectOption<number>[] = [];
    filteredMethods: SearchableSelectOption<string>[] = [];
    fishingPointSearchableSelectConfig: SearchableSelectConfig;
    minDate: Date;
    maxDate: Date;
    existingSurveyEventsWithLocationMethodAndOccurrenceDate: Array<SurveyEvent>;

    private allMethods: Array<Method>;
    private formSubscription: Subscription;

    constructor(private surveyEventService: SurveyEventsService, private activatedRoute: ActivatedRoute,
                private router: Router, private formBuilder: FormBuilder, private locationsService: LocationsService,
                private methodsService: MethodsService, private _location: Location, private projectService: ProjectService) {
        this.fishingPointSearchableSelectConfig = new SearchableSelectConfigBuilder()
            .minQueryLength(2)
            .searchPlaceholder('Minstens 2 karakters...')
            .build();
    }

    ngOnInit(): void {
        this.projectService.getProject(this.activatedRoute.parent.snapshot.params.projectCode)
            .pipe(take(1))
            .subscribe(value => {
                this.minDate = new Date(value.start);
                this.maxDate = new Date(value.end ? new Date(value.end) > new Date() ? new Date() : new Date(value.end) : new Date());
            });


        const projectId = this.activatedRoute.parent.snapshot.queryParams.projectId;
        this.createSurveyEventForm = this.formBuilder.group(
            {
                occurrenceDate: [undefined, [Validators.required]],
                fishingPointId: [undefined, [Validators.required]],
                method: [undefined, [Validators.required]],
                comment: ['', Validators.maxLength(800)],
            }, {asyncValidators: [uniqueNewValidator(projectId, this.surveyEventService)]});

        this.getMethods(null);

        this.formSubscription = this.createSurveyEventForm
            .valueChanges
            .pipe(
                debounceTime(500),
                filter(() => {
                    return this.createSurveyEventForm.valid;
                }),
                switchMap(() => this.surveyEventService
                    .searchSurveyEvents(
                        this.createSurveyEventForm.get('fishingPointId').value,
                        this.createSurveyEventForm.get('method').value,
                        startOfDay(new Date(this.createSurveyEventForm.get('occurrenceDate').value))),
                ),
                tap(foundSurveyEvents => this.existingSurveyEventsWithLocationMethodAndOccurrenceDate = foundSurveyEvents),
            ).subscribe();
    }

    ngOnDestroy() {
        this.formSubscription.unsubscribe();
    }

    getLocations(searchTerm: string) {
        this.locationsService
            .searchFishingPoints(searchTerm, undefined)
            .pipe(take(1))
            .subscribe(fishingPoints =>
                this.fishingPoints = fishingPoints
                    .map(fishingPoint => ({
                        displayValue: fishingPoint.code,
                        value: fishingPoint.id,
                    })));
    }

    getMethods(searchQuery: string) {
        (this.allMethods ?
            of(this.allMethods)
            : this.methodsService.getAllMethods())
            .pipe(
                take(1),
                tap(allMethods => this.allMethods = allMethods),
                map((values: Method[]) => searchQuery === null
                    ? values
                    : values.filter(value =>
                        value.description.toLowerCase().includes(searchQuery.toLowerCase())
                        || value.code.toLowerCase().includes(searchQuery.toLowerCase()))),
            ).subscribe(
            methods =>
                this.filteredMethods = methods
                    .map(method => ({
                        displayValue: `${method.code} - ${method.description}`,
                        value: method.code,
                    })));

    }

    createSurveyEvent() {
        this.existingSurveyEventsWithLocationMethodAndOccurrenceDate = [];
        this.submitted = true;

        if (this.createSurveyEventForm.invalid) {
            return;
        }


        const formData = this.createSurveyEventForm.getRawValue();

        this.surveyEventService
            .createSurveyEvent(this.activatedRoute.parent.snapshot.params.projectCode, formData)
            .pipe(
                take(1),
                tap(surveyEvent => this.router.navigate([
                    'projecten',
                    this.activatedRoute.parent.snapshot.params.projectCode,
                    'waarnemingen', surveyEvent.surveyEventId,
                ])),
            ).subscribe();
    }

    hasUnsavedData(): boolean {
        return this.createSurveyEventForm.dirty && !this.submitted;
    }

    @HostListener('window:beforeunload')
    hasUnsavedDataBeforeUnload(): any {
        // Return false when there is unsaved data to show a dialog
        return !this.hasUnsavedData();
    }

    cancel() {
        this._location.back();
    }

    get occurrenceDate() {
        return this.createSurveyEventForm.get('occurrenceDate');
    }

    get location() {
        return this.createSurveyEventForm.get('location');
    }

    get comment() {
        return this.createSurveyEventForm.get('comment');
    }

    get method() {
        return this.createSurveyEventForm.get('method');
    }

    get form() {
        return this.createSurveyEventForm;
    }
}

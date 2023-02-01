import {Component, HostListener, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {SurveyEventsService} from '../../../services/vis.surveyevents.service';
import {SearchableSelectOption} from '../../../shared-ui/searchable-select/SearchableSelectOption';
import {debounceTime, filter, map, switchMap, take, tap} from 'rxjs/operators';
import {FishingPointsService} from '../../../services/vis.fishing-points.service';
import {Method} from '../../../domain/method/method';
import {MethodsService} from '../../../services/vis.methods.service';
import {Role} from '../../../core/_models/role';
import {SurveyEvent} from '../../../domain/survey-event/surveyEvent';
import {Location} from '@angular/common';
import {HasUnsavedData} from '../../../core/core.interface';
import {ProjectService} from '../../../services/vis.project.service';
import {SearchableSelectConfigBuilder} from '../../../shared-ui/searchable-select/SearchableSelectConfig';
import {of, Subscription} from 'rxjs';
import {uniqueNewValidator} from '../survey-event-validators';
import {startOfDay} from 'date-fns';

@Component({
    selector: 'app-survey-event-detail-edit-page',
    templateUrl: './survey-event-detail-edit-page.component.html',
})
export class SurveyEventDetailEditPageComponent implements OnInit, HasUnsavedData {

    public role = Role;

    surveyEventForm: UntypedFormGroup;
    submitted = false;
    surveyEvent: SurveyEvent;

    fishingPoints: SearchableSelectOption<number>[] = [];
    filteredMethods: SearchableSelectOption<string>[] = [];
    fishingPointSearchableSelectConfig = new SearchableSelectConfigBuilder()
        .minQueryLength(2)
        .searchPlaceholder('Minstens 2 karakters...')
        .build();
    minDate: Date;
    maxDate: Date;
    existingSurveyEventsWithLocationMethodAndOccurrenceDate: Array<SurveyEvent>;

    private allMethods: Array<Method>;
    private projectId: number;
    private formSubscription: Subscription;

    constructor(private surveyEventService: SurveyEventsService,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private formBuilder: UntypedFormBuilder,
                private locationsService: FishingPointsService,
                private methodsService: MethodsService,
                private _location: Location,
                private projectService: ProjectService) {
    }

    ngOnInit(): void {
        this.surveyEventForm = this.formBuilder.group(
            {
                occurrenceDate: [null, [Validators.required]],
                fishingPointId: [null, [Validators.required]],
                method: ['', [Validators.required]],
                comment: ['', Validators.maxLength(800)],
            });

        this.activatedRoute
            .parent
            .paramMap
            .subscribe(
                paramMap => {
                    const projectCode = paramMap.get('projectCode');
                    const surveyEventId = paramMap.has('surveyEventId') ? parseInt(paramMap.get('surveyEventId')) : undefined;

                    this.projectService.getProject(projectCode)
                        .pipe(take(1))
                        .subscribe(value => {
                            this.projectId = value.projectId;
                            this.minDate = new Date(value.start);
                            // Set max date to today's date or to survey end date
                            this.maxDate = value.end ? new Date(value.end) > new Date() ? new Date() : new Date(value.end) : new Date();
                            this.form.setAsyncValidators([uniqueNewValidator(this.projectId, this.surveyEventService, surveyEventId)]);
                        });

                    this.surveyEventService.getSurveyEvent(projectCode, surveyEventId)
                        .pipe(take(1))
                        .subscribe(surveyEvent => {
                            this.surveyEvent = surveyEvent;

                            this.occurrenceDate.patchValue(new Date(surveyEvent.occurrence));
                            this.location.patchValue(surveyEvent.fishingPoint?.id);
                            this.comment.patchValue(surveyEvent.comment);
                            this.method.patchValue(surveyEvent.method);

                            this.getLocations(null);
                            this.getMethods(null);
                        })
                },
            );

        this.formSubscription = this.surveyEventForm
            .valueChanges
            .pipe(
                debounceTime(500),
                filter(() => {
                    return this.surveyEventForm.valid;
                }),
                switchMap(() => this.surveyEventService
                    .searchSurveyEvents(
                        this.surveyEventForm.get('fishingPointId').value,
                        this.surveyEventForm.get('method').value,
                        startOfDay(new Date(this.surveyEventForm.get('occurrenceDate').value))),
                ),
                tap(foundSurveyEvents =>
                    this.existingSurveyEventsWithLocationMethodAndOccurrenceDate = foundSurveyEvents
                        .filter(surveyEvent => surveyEvent.surveyEventId !== this.surveyEvent.surveyEventId)),
            ).subscribe();
    }

    getLocations(searchQuery: string) {
        this.locationsService
            .searchFishingPoints(searchQuery, this.surveyEvent?.fishingPoint?.id)
            .pipe(take(1))
            .subscribe(fishingPoints =>
                this.fishingPoints = fishingPoints
                    .map(fishingPoint => ({
                        displayValue: `${fishingPoint.code} - ${fishingPoint.description}`,
                        value: fishingPoint.id,
                        externalLink: `/locations/${fishingPoint.code}`,
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

    saveSurveyEvent() {
        this.submitted = true;

        if (this.surveyEventForm.invalid) {
            return;
        }

        const formData = this.surveyEventForm.getRawValue();

        this.surveyEventService
            .updateSurveyEvent(this.activatedRoute.parent.snapshot.params.projectCode,
                this.activatedRoute.parent.snapshot.params.surveyEventId, formData)
            .pipe(take(1))
            .subscribe(() => {
                this.router.navigate(['projecten', this.activatedRoute.parent.snapshot.params.projectCode,
                    'waarnemingen', this.activatedRoute.parent.snapshot.params.surveyEventId]);
            });
    }

    get occurrenceDate() {
        return this.surveyEventForm.get('occurrenceDate');
    }

    get location() {
        return this.surveyEventForm.get('fishingPointId');
    }

    get method() {
        return this.surveyEventForm.get('method');
    }

    get comment() {
        return this.surveyEventForm.get('comment');
    }

    get form() {
        return this.surveyEventForm;
    }

    hasUnsavedData(): boolean {
        return this.surveyEventForm.touched && this.surveyEventForm.dirty && !this.submitted;
    }

    @HostListener('window:beforeunload')
    hasUnsavedDataBeforeUnload(): any {
        // Return false when there is unsaved data to show a dialog
        return this.hasUnsavedData();
    }

    cancel() {
        this._location.back();
    }
}

import {
    AfterViewChecked,
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    HostListener,
    OnDestroy,
    OnInit,
    QueryList,
    ViewChildren,
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormArray, FormControl, FormGroup, UntypedFormBuilder, Validators} from '@angular/forms';
import {fromEvent, Observable, Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';
import {AlertService} from '../../../_alert';
import {SurveyEventsService} from '../../../services/vis.surveyevents.service';
import {TaxaService} from '../../../services/vis.taxa.service';
import {TipsService} from '../../../services/vis.tips.service';
import {Tip} from '../../../domain/tip/tip';
import {Measurement} from '../../../domain/survey-event/measurement';
import {HasUnsavedData} from '../../../core/core.interface';
import {Location} from '@angular/common';
import {faRulerHorizontal, faWeightHanging} from '@fortawesome/free-solid-svg-icons';
import * as IntroJs from 'intro.js/intro.js';
import {MeasurementRowComponent} from '../measurement-row/measurement-row.component';
import {MeasurementRowEnterEvent} from '../measurement-row/measurement-row-enter-event.model';
import {lengthOrWeightRequiredForIndividualMeasurement} from './validators/length-or-weight-required-for-individual.measurement';
import {WarningFormControl} from '../../../shared-ui/warning-form-control/warning.form-control';

@Component({
    selector: 'app-survey-event-measurements-create-page',
    templateUrl: './survey-event-measurements-create-page.component.html',
})
export class SurveyEventMeasurementsCreatePageComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked, HasUnsavedData {
    get measurementRows(): QueryList<MeasurementRowComponent> {
        return this._measurementRows;
    }

    @ViewChildren(MeasurementRowComponent)
    set measurementRows(value: QueryList<MeasurementRowComponent>) {
        if (value?.length > 0 && !this.firstOneHasBeenFocused) {
            value.first.focusElement('species', 0);
            this.firstOneHasBeenFocused = true;
        }
        this._measurementRows = value;
    }

    @ViewChildren('lines') lines: QueryList<HTMLDivElement>;
    @ViewChildren(MeasurementRowComponent, {read: ElementRef}) measurementRowDOMElements: QueryList<ElementRef<HTMLElement>>;

    private _measurementRows: QueryList<MeasurementRowComponent>;
    faRulerHorizontal = faRulerHorizontal;
    faWeightHanging = faWeightHanging;

    introModalOpen = false;
    introJs: IntroJs;

    tip$: Observable<Tip>;

    existingMeasurements: Measurement[];
    measurementsForm: FormGroup;
    submitted = false;
    showExistingMeasurements = false;
    loading = false;
    isAnkerkuilSurvey = false;

    private firstOneHasBeenFocused = false;
    private scrollIntoView = false;
    private subscription = new Subscription();

    constructor(private activatedRoute: ActivatedRoute,
                private formBuilder: UntypedFormBuilder,
                private surveyEventsService: SurveyEventsService,
                private alertService: AlertService,
                private taxaService: TaxaService,
                private router: Router,
                private tipsService: TipsService,
                private _location: Location,
                private changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.tip$ = this.tipsService.randomTipForPage('METING');

        this.surveyEventsService
            .getSurveyEvent(this.activatedRoute.parent.snapshot.params.projectCode, this.activatedRoute.parent.snapshot.params.surveyEventId)
            .subscribe(
                surveyEvent => {
                    this.isAnkerkuilSurvey = ['AK', 'AKV', 'AKE'].includes(surveyEvent.method);
                    this.initForm();
                },
            );

        this.subscription.add(
            fromEvent(window, 'keydown').pipe(
                filter((event: KeyboardEvent) => {
                    return event.ctrlKey && this.isKeyLowerM(event.key);
                }))
                .subscribe(() => {
                    this.addNewLine();
                    setTimeout(() => {
                        document.getElementById(`species-${this.items().length - 1}-button`).focus();
                    }, 0);
                }),
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    ngAfterViewInit() {
        if (localStorage.getItem('measurements-demo') !== 'completed') {
            setTimeout(() => this.introModalOpen = true);
        }
    }

    ngAfterViewChecked() {
        if (this.scrollIntoView) {
            document.getElementById('species-' + (this.items().length - 1))?.scrollIntoView();
            this.scrollIntoView = false;
        }
    }

    initForm() {
        this.measurementsForm = this.formBuilder.group({
            items: this.formBuilder.array([this.createMeasurementFormGroup()]),
        });
    }

    createMeasurementFormGroup(speciesId?: number, gender?: string, afvisbeurt?: number, comment?: string, isPortside?: boolean, dilutionFactor?: number): FormGroup {
        return this.formBuilder.group({
            type: new FormControl('NORMAL'),
            species: new FormControl<number>(speciesId, [Validators.required]),
            amount: new FormControl<number>(1, Validators.min(0)),
            length: new WarningFormControl(null, [Validators.min(0)]),
            weight: new WarningFormControl(null, [Validators.min(0)]),
            gender: new FormControl<string>(gender ?? 'UNKNOWN'),
            isPortside: new FormControl<boolean>(isPortside ?? false),
            afvisBeurtNumber: new FormControl<number>(1),
            dilutionFactor: new FormControl<number>(dilutionFactor == null ? 1 : dilutionFactor, [Validators.min(0)]),
            comment: new FormControl<string>(comment ?? '', Validators.max(2000)),
            individualLengths: this.formBuilder.array([]),
        }, {
            validators: [lengthOrWeightRequiredForIndividualMeasurement(),
            ],
        });
    }

    addNewLine() {
        this.items().push(this.createMeasurementFormGroup(
            this.getPreviousSpecies(),
            this.getPreviousGender(),
            this.getPreviousAfvisbeurt(),
            this.getPreviousComment(),
            this.getPreviousPortside(),
            this.getPreviousDilutionFactor()));
        this.scrollIntoView = true;
    }

    items(): FormArray {
        return this.measurementsForm.get('items') as FormArray;
    }

    getPreviousSpecies() {
        return this.species(this.items().length - 1).value;
    }

    getPreviousGender() {
        return this.gender(this.items().length - 1).value;
    }

    getPreviousAfvisbeurt() {
        return this.afvisBeurtNumber(this.items().length - 1).value;
    }

    getPreviousComment() {
        return this.comment(this.items().length - 1).value;
    }

    onKeyPress(event: KeyboardEvent, index: number) {
        if (this.isKeyTab(event.key) && this.isLastIndex(index)) {
            this.addNewLine();
        }
    }

    createMeasurements() {
        if (this.measurementsForm.invalid) {
            this.submitted = true;
            return;
        }

        const measurements = this.measurementsForm.getRawValue();
        measurements.items.forEach(measurement => {
            if (measurement.amount > 1) {
                measurement.length = null;
            }
        });

        this.subscription.add(this.surveyEventsService.createMeasurements(measurements, this.activatedRoute.parent.snapshot.params.projectCode,
            this.activatedRoute.parent.snapshot.params.surveyEventId)
            .subscribe(value => {
                // TODO exception is caught in http.error.interceptor and then mapped to a custom result that is not typesafe
                // @ts-ignore
                if (value?.code === 400) {
                    this.alertService.error('Validatie fouten', 'Het bewaren is niet gelukt, controleer alle gegevens of contacteer een verantwoordelijke.');
                } else {
                    this.submitted = true;
                    this.router.navigate(['/projecten', this.activatedRoute.parent.snapshot.params.projectCode, 'waarnemingen',
                        this.activatedRoute.parent.snapshot.params.surveyEventId, 'metingen']);
                }
            }));
    }

    remove(i: number) {
        if (this.items().length === 1) {
            this.alertService.warn('Opgelet', 'De laatste meting kan niet verwijdert worden.');
            return;
        }
        this.items().removeAt(i);
    }

    private isKeyTab(key: string) {
        return key === 'Tab';
    }

    private isKeyLowerM(key: string) {
        return key === 'm';
    }

    private isLastIndex(i: number) {
        return this.items() === undefined || (i + 1) === this.items().length;
    }

    species(index: number) {
        return this.items().at(index).get('species');
    }

    afvisBeurtNumber(index: number) {
        return this.items().at(index).get('afvisBeurtNumber');
    }

    weight(index: number) {
        return this.items().at(index).get('weight');
    }

    length(index: number) {
        return this.items().at(index).get('length');
    }

    amount(index: number) {
        return this.items().at(index).get('amount');
    }

    gender(index: number) {
        return this.items().at(index).get('gender');
    }

    comment(index: number) {
        return this.items().at(index).get('comment');
    }

    isNormalType(index: number) {
        return this.items().at(index).get('type').value === 'NORMAL';
    }

    isGroupType(index: number) {
        return this.items().at(index).get('type').value === 'GROUP';
    }

    showExistingMeasurementsClick() {
        if (this.showExistingMeasurements) {
            this.showExistingMeasurements = false;
            this.loading = false;
            this.existingMeasurements = [];
        } else {
            this.showExistingMeasurements = true;
            this.loading = true;
            this.surveyEventsService.getAllMeasurementsForSurveyEvent(
                this.activatedRoute.parent.snapshot.params.projectCode, this.activatedRoute.parent.snapshot.params.surveyEventId);

            this.subscription.add(this.surveyEventsService.getAllMeasurementsForSurveyEvent(
                this.activatedRoute.parent.snapshot.params.projectCode, this.activatedRoute.parent.snapshot.params.surveyEventId)
                .subscribe(value => {
                    this.existingMeasurements = value;
                    this.loading = false;
                }));
        }
    }

    hasUnsavedData(): boolean {
        return this.measurementsForm.dirty && !this.submitted;
    }

    @HostListener('window:beforeunload')
    hasUnsavedDataBeforeUnload(): any {
        // Return false when there is unsaved data to show a dialog
        return !this.hasUnsavedData();
    }

    cancel() {
        this._location.back();
    }

    cancelModal() {
        this.introModalOpen = false;
    }

    confirmModal() {
        this.initForm();

        this.introModalOpen = false;

        this.introJs = IntroJs();
        this.introJs.setOptions({
            showBullets: false,
            hidePrev: true,
            nextLabel: 'Volgende',
            doneLabel: 'Klaar',
        });
        this.introJs.oncomplete(() => {
            this.initForm();
            localStorage.setItem('measurements-demo', 'completed');
        });
        this.introJs.onexit(() => {
            this.initForm();
            localStorage.setItem('measurements-demo', 'completed');
        });

        this.introJs.onbeforechange(() => {
            switch (this.introJs.currentStep()) {
                case 3:
                    this.amount(0).patchValue(2);
                    this.items().at(0).get('type').patchValue('GROUP');
                    this.changeDetectorRef.detectChanges();
                    break;
                case 5:
                    this._measurementRows.get(0).toGroupMeasurement();
                    this.changeDetectorRef.detectChanges();
                    break;
            }
        });

        setTimeout(() => this.introJs.start());
    }

    playIntro() {
        this.introModalOpen = true;
    }

    doNotShowAgain() {
        localStorage.setItem('measurements-demo', 'completed');
        this.introModalOpen = false;
    }

    measurementRowEnterClicked(event: MeasurementRowEnterEvent) {
        if (event.fieldName !== 'species') {
            if (this.measurementRowDOMElements.last.nativeElement.contains(event.event.target as any)) {
                this.addNewLine();
                this.changeDetectorRef.detectChanges();
                this._measurementRows.last.focusElement(event.fieldName, this._measurementRows.last.formGroupName);
            } else {
                const nextRowIndex = this.measurementRowDOMElements.toArray().findIndex(element => element.nativeElement.contains(event.event.target as any));
                const nextRow = this._measurementRows.get(nextRowIndex + 1);
                nextRow.focusElement(event.fieldName, nextRow.formGroupName);
            }
        }
    }

    private getPreviousPortside() {
        return this.isPortside(this.items().length - 1).value;
    }

    private getPreviousDilutionFactor() {
        return this.dilutionFactor(this.items().length - 1).value;
    }

    private isPortside(index: number) {
        return this.items().at(index).get('isPortside');
    }

    private dilutionFactor(index: number) {
        return this.items().at(index).get('dilutionFactor');
    }
}

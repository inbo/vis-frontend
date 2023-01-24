import {Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {AsyncPage} from '../../../shared-ui/paging-async/asyncPage';
import {IndividualLength, Measurement} from '../../../domain/survey-event/measurement';
import {SurveyEventsService} from '../../../services/vis.surveyevents.service';
import {take} from 'rxjs/operators';
import {SurveyEvent} from '../../../domain/survey-event/surveyEvent';
import {Role} from '../../../core/_models/role';
import {AuthService} from '../../../core/auth.service';
import {faRulerHorizontal, faWeightHanging} from '@fortawesome/free-solid-svg-icons';
import {UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {MeasurementRowComponent} from '../measurement-row/measurement-row.component';
import {PagingAsyncComponent} from '../../../shared-ui/paging-async/paging-async.component';
import {MeasurementRowReadonlyComponent} from '../measurement-row-readonly/measurement-row-readonly.component';
import {
    lengthOrWeightRequiredForIndividualMeasurement,
} from '../survey-event-measurements-create-page/survey-event-measurements-validators';
import {Subscription} from 'rxjs';
import {MeasurementRowEnterEvent} from '../measurement-row/measurement-row-enter-event.model';

@Component({
    selector: 'app-survey-event-measurements-page',
    templateUrl: './survey-event-measurements-page.component.html',
})
export class SurveyEventMeasurementsPageComponent implements OnInit, OnDestroy {
    @ViewChildren(MeasurementRowComponent) measurementRowComponents!: QueryList<MeasurementRowComponent>;
    @ViewChildren(MeasurementRowReadonlyComponent) measurementRowReadonlyComponents!: QueryList<MeasurementRowReadonlyComponent>;

    @ViewChild(PagingAsyncComponent) pagingComponent: PagingAsyncComponent;

    faRulerHorizontal = faRulerHorizontal;
    faWeightHanging = faWeightHanging;

    public role = Role;

    projectCode: any;
    surveyEventId: number;

    isModalOpen = false;
    loading = false;
    measurementToBeDeleted: number;
    pager: AsyncPage<Measurement>;
    measurements: Measurement[];
    isAnkerkuil = false;

    surveyEvent: SurveyEvent;
    form: UntypedFormGroup;
    rowEditNumber: number;
    savedIndex: number;

    subscription = new Subscription();

    constructor(private titleService: Title, private surveyEventsService: SurveyEventsService, private activatedRoute: ActivatedRoute,
                public authService: AuthService, private formBuilder: UntypedFormBuilder) {
        this.surveyEventId = this.activatedRoute.parent.snapshot.params.surveyEventId;
        this.projectCode = this.activatedRoute.parent.snapshot.params.projectCode;
        this.titleService.setTitle('Waarneming metingen ' + this.activatedRoute.parent.snapshot.params.surveyEventId);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    ngOnInit(): void {
        this.init();
        this.form = this.formBuilder.group({
            items: this.formBuilder.array([]),
        });
    }

    createMeasurementFormGroup(measurement: Measurement) {
        const il = measurement.individualLengths ? measurement.individualLengths.map(value => this.createIndividualLength(value)) : [];
        return this.formBuilder.group({
            id: new UntypedFormControl(measurement.id),
            order: new UntypedFormControl(measurement.order),
            type: new UntypedFormControl(measurement.type),
            species: new UntypedFormControl(measurement.taxon.id, [Validators.required]),
            amount: new UntypedFormControl(measurement.amount, Validators.min(0)),
            length: new UntypedFormControl(measurement.length ? measurement.length.toString() : '', [Validators.min(0)]),
            weight: new UntypedFormControl(measurement.weight ? measurement.weight.toString() : '', [Validators.min(0)]),
            gender: new UntypedFormControl(measurement.gender ? measurement.gender : 'UNKNOWN'),
            afvisBeurtNumber: new UntypedFormControl(measurement.afvisBeurtNumber, [Validators.min(1), Validators.max(10)]),
            comment: new UntypedFormControl(measurement.comment ? measurement.comment : '', Validators.max(2000)),
            individualLengths: this.formBuilder.array(il),
            dilutionFactor: new UntypedFormControl(measurement.dilutionFactor || 1, [Validators.min(0)]),
            isPortside: new UntypedFormControl(measurement.portside ?? true),
        }, {validators: [lengthOrWeightRequiredForIndividualMeasurement()]});
    }

    createIndividualLength(individualLength: IndividualLength): UntypedFormGroup {
        return this.formBuilder.group({
            id: new UntypedFormControl(individualLength.id),
            length: new UntypedFormControl(individualLength.length, [Validators.min(0)]),
            comment: new UntypedFormControl(individualLength.comment, Validators.max(2000)),
        });
    }

    items(): UntypedFormArray {
        return this.form.get('items') as UntypedFormArray;
    }

    private init() {
        this.activatedRoute.queryParams.subscribe((params) => {
            const sort = params.sort ? params.sort : null;
            this.loadMeasurements(params.page ? params.page : 1, params.size ? params.size : 20, sort);
        });

        this.surveyEventsService.getSurveyEvent(this.activatedRoute.parent.snapshot.params.projectCode,
            this.activatedRoute.parent.snapshot.params.surveyEventId)
            .pipe(take(1))
            .subscribe(value => {
                this.surveyEvent = value;
                this.isAnkerkuil = ['AK', 'AKE', 'AKV'].includes(value.method);
            });
    }

    loadMeasurements(page: number, size: number, sort: string) {
        this.loading = true;
        this.surveyEventsService.getMeasurements(this.projectCode, this.surveyEventId, page, size, sort).subscribe((value) => {
            this.pager = value;
            this.measurements = value.content;
            this.loading = false;

            (this.form.get('items') as UntypedFormArray).clear();

            value.content.forEach(measurement => {
                (this.form.get('items') as UntypedFormArray).push(this.createMeasurementFormGroup(measurement));
            });
        });
    }

    deleteClicked(i: number) {
        this.measurementToBeDeleted = i;
        this.isModalOpen = true;
    }

    cancelModal() {
        this.isModalOpen = false;
    }

    confirmClicked() {
        this.surveyEventsService.deleteMeasurement(this.projectCode, this.surveyEventId,
            this.items().at(this.measurementToBeDeleted).get('id').value)
            .pipe(take(1))
            .subscribe(() => {
                this.init();
                this.cancelModal();
            });
    }

    save(i: number) {
        const data = this.items().at(i) as UntypedFormGroup;

        const measurement = data.getRawValue();
        if (measurement.amount > 1) {
            measurement.length = null;
        }
        this.surveyEventsService.saveMeasurement(this.projectCode, this.surveyEventId, data.get('id').value, measurement)
            .pipe(take(1))
            .subscribe(() => {
                this.savedIndex = this.rowEditNumber;
                this.rowEditNumber = null;
                this.init();
            });
    }

    cancel(i: number) {
        this.items().at(i).reset(this.createMeasurementFormGroup(this.measurements[i]).getRawValue());
        this.rowEditNumber = null;
    }

    enterClicked(i: number, event: MeasurementRowEnterEvent) {
        if (i + 1 === this.measurements.length) {
            this.pagingComponent.next();
        }

        const data = this.items().at(i) as UntypedFormGroup;

        if (data.invalid) {
            return;
        }

        if (!data.dirty) {
            this.rowEditNumber = i + 1;
            this.focusFieldname(event.fieldName);
            return;
        }

        this.surveyEventsService.saveMeasurement(this.projectCode, this.surveyEventId, data.get('id').value, data.getRawValue())
            .pipe(take(1))
            .subscribe(() => {
                this.savedIndex = this.rowEditNumber;
                this.rowEditNumber = i + 1;
                this.focusFieldname(event.fieldName);

            });
    }

    private focusFieldname(fieldName: string) {
        setTimeout(() => {
            const element = this.measurementRowComponents.get(0);
            if (element !== undefined) {
                element.focusElement(fieldName, this.rowEditNumber);
            }
        }, 0);
    }
}

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {SearchableSelectOption} from '../../../shared-ui/searchable-select/SearchableSelectOption';
import {TaxaService} from '../../../services/vis.taxa.service';
import {
    AbstractControl,
    FormArray,
    FormGroup,
    FormGroupDirective,
    UntypedFormArray,
    UntypedFormBuilder,
    UntypedFormControl,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import {Subscription} from 'rxjs';
import {faRulerHorizontal, faWeightHanging} from '@fortawesome/free-solid-svg-icons';
import {weightLengthRatioValidator} from '../survey-event-measurements-create-page/validators/weight-length-ratio.warning-validator';
import {TaxonDetail} from '../../../domain/taxa/taxon-detail';
import {MeasurementRowEnterEvent} from './measurement-row-enter-event.model';
import {isNil} from 'lodash-es';
import {take} from 'rxjs/operators';
import {valueBetweenWarning} from '../survey-event-measurements-create-page/validators/value-between.warning-validator';
import {WarningFormControl} from '../../../shared-ui/warning-form-control/warning.form-control';
import {measurementWeightValidator} from '../survey-event-measurements-create-page/validators/measurement-weight.validator';
import {measurementAmountValidator} from '../survey-event-measurements-create-page/validators/measurement-amount.validator';

@Component({
    selector: 'vis-measurement-row',
    templateUrl: './measurement-row.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeasurementRowComponent implements OnInit, OnDestroy {

    faWeightHanging = faWeightHanging;
    faRulerHorizontal = faRulerHorizontal;

    @Input() formGroupName: number;
    @Input() submitted = false;
    @Input() editMode = false;
    @Input() isAnkerkuil = false;


    @Output() newline = new EventEmitter<any>();
    @Output() removeClicked = new EventEmitter<number>();
    @Output() saveClicked = new EventEmitter<any>();
    @Output() cancelClicked = new EventEmitter<any>();
    @Output() enterClicked = new EventEmitter<MeasurementRowEnterEvent>();

    measurementForm: FormGroup;
    filteredTaxonOptions: SearchableSelectOption<number>[] = [];
    showIndividualLengthItems = true;
    taxon: TaxonDetail;
    private allTaxonOptions: Array<SearchableSelectOption<number>> = [];
    measurementsFormArray: UntypedFormArray;
    private subscription = new Subscription();

    constructor(private taxaService: TaxaService,
                private rootFormGroup: FormGroupDirective,
                private formBuilder: UntypedFormBuilder,
                private changeDetectorRef: ChangeDetectorRef) {
    }

    get fieldsOrder() {
        return this.isAnkerkuil ? [
            'species',
            'amount',
            'length',
            'weight',
            'gender',
            'isPortside',
            'dilutionFactor',
            'comment',
        ] : [
            'species',
            'amount',
            'length',
            'weight',
            'gender',
            'afvisBeurtNumber',
            'comment',
        ];
    }

    ngOnInit(): void {
        this.measurementsFormArray = this.rootFormGroup.control.get('items') as FormArray;
        this.measurementForm = this.measurementsFormArray.at(this.formGroupName) as FormGroup;

        this.addTaxaValidationsForRowIndex();

        this.taxaService
            .getAllSpeciesOptions()
            .subscribe(taxonOptions => {
                this.allTaxonOptions = taxonOptions;
                this.filteredTaxonOptions = [...this.allTaxonOptions];
                this.changeDetectorRef.detectChanges();
            });

        this.focusElement('species', this.formGroupName);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    onSpeciesChange() {
        this.addTaxaValidationsForRowIndex();
        this.enterPressed({fieldName: 'species', event: undefined});
        this.changeDetectorRef.detectChanges();
    }

    navigateOnArrow({key, currentTarget}: KeyboardEvent) {
        let fieldName: string;
        if (!currentTarget) {
            fieldName = 'species';
        } else {
            fieldName = (currentTarget as HTMLElement).id.split('-')[0];
        }

        if (key === 'ArrowUp') {
            this.focusElement(fieldName, this.formGroupName - 1);
        } else if (key === 'ArrowDown') {
            this.focusElement(fieldName, this.formGroupName + 1);
        } else if (key === 'ArrowLeft') {
            const previousField = this.getEnabledPreviousFieldName(fieldName);

            this.focusElement(previousField, this.formGroupName);
        } else if (key === 'ArrowRight') {
            const nextField = this.getEnabledNextFieldName(fieldName);

            this.focusElement(nextField, this.formGroupName);
        }
    }

    filterSpecies(search: string) {
        if (isNil(search) || search.length === 0) {
            this.filteredTaxonOptions = [...this.allTaxonOptions];
        }
        this.filteredTaxonOptions = this.allTaxonOptions.filter(taxon => taxon.displayValue.toLowerCase().includes(search.toLowerCase()));
        this.changeDetectorRef.detectChanges();
    }

    remove() {
        this.removeClicked.emit(this.formGroupName);
    }

    getSpecies(): AbstractControl {
        return this.measurementForm.get('species');
    }

    getAfvisBeurtNumber(): AbstractControl {
        return this.measurementForm.get('afvisBeurtNumber');
    }

    getWeight() {
        return this.measurementForm.get('weight');
    }

    getLength() {
        return this.measurementForm.get('length');
    }

    getAmount(): AbstractControl {
        return this.measurementForm.get('amount');
    }

    getGender(): AbstractControl {
        return this.measurementForm.get('gender');
    }

    getComment(): AbstractControl {
        return this.measurementForm.get('comment');
    }

    getType(): AbstractControl {
        return this.measurementForm.get('type');
    }

    focusElement(field: string, index: number) {
        const element = document.getElementById(field + '-' + index + (field === 'species' ? '-button' : ''));
        if (element !== null) {
            setTimeout(() => element.focus(), 0);
        }
    }

    getIndividualLengths(): UntypedFormArray {
        return this.measurementForm.get('individualLengths') as UntypedFormArray;
    }

    toGroupMeasurement() {
        this.measurementForm.get('length').patchValue(null);
        this.measurementForm.get('gender').patchValue(null);
        this.measurementForm.get('type').patchValue('GROUP_LENGTHS');

        this.getIndividualLengths().clear();
        const amount = this.getAmount().value;
        const individualLengthsSize = amount >= 10 ? 10 : amount;
        this.getIndividualLengths().push(this.createIndividualLength());

        this.getAmount().setValidators(Validators.min(individualLengthsSize));
        this.setTaxonValidators(this.taxon);
        this.changeDetectorRef.detectChanges();
    }

    toIndividualMeasurement() {
        this.getIndividualLengths().patchValue([]);
        this.measurementForm.get('type').patchValue(this.getAmount().value > 1 ? 'GROUP' : 'NORMAL');
        this.setTaxonValidators(this.taxon);
        this.changeDetectorRef.detectChanges();
    }

    enterPressed(event: MeasurementRowEnterEvent) {
        if (event.fieldName === 'species') {
            this.navigateOnArrow({...event.event, key: 'ArrowRight'});
        } else {
            this.enterClicked.emit(event);
        }
    }

    // Add new line when tab is pressed in the comment field
    tabPressed() {
        if (!this.editMode) {
            if (this.isLastIndex(this.formGroupName)) {
                this.newline.emit(true);
            }
        }
    }

    save() {
        this.saveClicked.emit();
    }

    cancel() {
        this.cancelClicked.emit();
    }

    private createIndividualLength(comment?: string): UntypedFormGroup {
        return this.formBuilder.group({
            length: new WarningFormControl(null, [Validators.min(0), Validators.required, ...(this.taxon ? [valueBetweenWarning(this.taxon?.lengthMin, this.taxon?.lengthMax, this.changeDetectorRef)] : [])]),
            comment: new UntypedFormControl(comment ?? '', Validators.maxLength(2000)),
        });
    }

    private addTaxaValidationsForRowIndex() {
        if (isNil(this.getSpecies().value)) {
            return;
        }

        const taxaId = this.getSpecies().value;

        if (!taxaId) {
            return;
        }

        this.taxaService
            .getTaxon(taxaId)
            .pipe(take(1))
            .subscribe(taxon => {
                this.taxon = taxon;
                this.setTaxonValidators(taxon);
                this.changeDetectorRef.detectChanges();
            });
    }

    private setTaxonValidators(taxon: TaxonDetail) {
        this.getWeight().setValidators([Validators.min(0)]);

        this.getLength().setValidators([Validators.min(0)]);

        if (taxon) {
            this.getWeight().addValidators(valueBetweenWarning(taxon.weightMin, taxon.weightMax, this.changeDetectorRef));
            this.getLength().addValidators(valueBetweenWarning(taxon.lengthMin, taxon.lengthMax, this.changeDetectorRef));
            this.getIndividualLengths().controls.forEach(control => {
                control.get('length').addValidators(valueBetweenWarning(taxon.lengthMin, taxon.lengthMax, this.changeDetectorRef));
            });
        }

        this.measurementForm.setValidators([weightLengthRatioValidator(taxon, this.changeDetectorRef), measurementWeightValidator(this.changeDetectorRef), measurementAmountValidator(this.changeDetectorRef)]);
        this.getWeight().updateValueAndValidity();
        this.getLength().updateValueAndValidity();
        this.measurementForm.updateValueAndValidity();
    }

    private getEnabledPreviousFieldName(currentFieldName: string) {
        const previousField = this.previousFieldName(currentFieldName);

        const element = document.getElementById(previousField + '-' + this.formGroupName + (previousField === 'species' ? '-button' : ''));
        // @ts-ignore
        if (element.disabled || element.readOnly) {
            return this.getEnabledPreviousFieldName(previousField);
        }

        return previousField;
    }

    private getEnabledNextFieldName(currentFieldName: string) {
        const nextField = this.nextFieldName(currentFieldName);

        const element = document.getElementById(nextField + '-' + this.formGroupName + (nextField === 'species' ? '-button' : ''));
        // @ts-ignore
        if (element.disabled || element.readOnly) {
            return this.getEnabledNextFieldName(nextField);
        }

        return nextField;
    }

    private isLastIndex(i: number) {
        return this.measurementsFormArray === undefined || (i + 1) === this.measurementsFormArray.length;
    }

    private previousFieldName(currentFieldName: string) {
        let nextId = this.fieldsOrder.indexOf(currentFieldName) - 1;
        if (nextId < 0) {
            nextId = 0;
        }

        return this.fieldsOrder[nextId];
    }

    private nextFieldName(currentFieldName: string) {
        let nextId = this.fieldsOrder.indexOf(currentFieldName) + 1;
        if (nextId > this.fieldsOrder.length - 1) {
            nextId = this.fieldsOrder.length - 1;
        }

        return this.fieldsOrder[nextId];
    }
}

import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {SearchableSelectOption} from '../../../shared-ui/searchable-select/SearchableSelectOption';
import {take} from 'rxjs/operators';
import {TaxaService} from '../../../services/vis.taxa.service';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {faRulerHorizontal, faWeightHanging} from '@fortawesome/free-solid-svg-icons';
import {
    lengthOrWeightRequiredForIndividualMeasurement,
    valueBetweenWarning,
} from '../survey-event-measurements-create-page/survey-event-measurements-validators';
import {TaxonDetail} from '../../../domain/taxa/taxon-detail';
import {Taxon} from '../../../domain/taxa/taxon';
import {MeasurementRowEnterEvent} from './measurement-row-enter-event.model';

@Component({
    selector: 'app-measurement-row',
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

    form: FormGroup;
    taxons: SearchableSelectOption<number>[] = [];
    showIndividualLengthItems = true;

    private taxon: TaxonDetail;
    private formArray: FormArray;
    private subscription = new Subscription();

    get fieldsOrder() {
        return this.isAnkerkuil ? [
            'species',
            'amount',
            'length',
            'weight',
            'gender',
            'isPortside',
            'dilutionFactor',
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

    constructor(private taxaService: TaxaService,
                private rootFormGroup: FormGroupDirective,
                private formBuilder: FormBuilder,
                private cdr: ChangeDetectorRef) {
    }

    numberMask(scale: number, min: number, max: number) {
        return {
            mask: Number,
            scale,
            signed: true,
            thousandsSeparator: '',
            radix: '.',
            min,
            max,
        };
    }

    ngOnInit(): void {
        this.formArray = this.rootFormGroup.control.get('items') as FormArray;
        this.form = this.formArray.at(this.formGroupName) as FormGroup;

        this.addTaxaValidationsForRowIndex();

        this.getSpecies(null, this.species().value);

        this.focusElement('species', this.formGroupName);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    onSpeciesChange() {
        this.addTaxaValidationsForRowIndex();
        this.enterPressed({fieldName: 'species', event: undefined});
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

    getSpecies(val: string, taxon?: Taxon) {
        this.taxaService
            .getTaxa(val, taxon?.id?.value)
            .pipe(
                take(1),
            ).subscribe(taxa => {
            this.taxons = taxa.map(taxon => ({
                displayValue: taxon.nameDutch,
                externalLink: `/vissoorten/${taxon.id.value}`,
                value: taxon.id.value,
            }));
            this.cdr.detectChanges();
        });
    }

    remove() {
        this.removeClicked.emit(this.formGroupName);
    }

    items() {
        return this.formArray;
    }

    onKeyPress(event: KeyboardEvent) {
        if (this.isKeyTab(event.key) && this.isLastIndex(this.formGroupName)) {
            this.newline.emit(true);
        }
    }

    species(): AbstractControl {
        return this.form.get('species');
    }

    afvisBeurtNumber(): AbstractControl {
        return this.form.get('afvisBeurtNumber');
    }

    weight() {
        return this.form.get('weight');
    }

    length() {
        return this.form.get('length');
    }

    formControl() {
        return this.form;
    }

    amount(): AbstractControl {
        return this.form.get('amount');
    }

    gender(): AbstractControl {
        return this.form.get('gender');
    }

    comment(): AbstractControl {
        return this.form.get('comment');
    }

    type(): AbstractControl {
        return this.form.get('type');
    }

    public focusElement(field: string, index: number) {
        const element = document.getElementById(field + '-' + index + (field === 'species' ? '-button' : ''));
        if (element !== null) {
            setTimeout(() => element.focus(), 0);
        }
    }

    focusWeight() {
        this.focusElement('length', this.formGroupName);
    }

    individualLengths(): FormArray {
        return this.form.get('individualLengths') as FormArray;
    }

    toGroupMeasurement() {
        this.form.get('length').patchValue(null);
        this.form.get('gender').patchValue(null);
        this.form.get('type').patchValue('GROUP_LENGTHS');

        this.individualLengths().clear();
        const amount = this.amount().value;
        const individualLengthsSize = amount >= 10 ? 10 : amount;
        this.individualLengths().push(this.createIndividualLength());

        this.amount().setValidators(Validators.min(individualLengthsSize));
        this.setTaxonValidators(this.taxon);
    }

    createIndividualLength(comment?: any): FormGroup {
        return this.formBuilder.group({
            length: new FormControl('', [Validators.min(0), Validators.required]),
            comment: new FormControl(comment ?? '', Validators.max(2000)),
        });
    }

    toIndividualMeasurement() {
        this.individualLengths().patchValue([]);
        this.form.get('type').patchValue(this.amount().value > 1 ? 'GROUP' : 'NORMAL');
        this.setTaxonValidators(this.taxon);
    }

    enterPressed(event: MeasurementRowEnterEvent) {
        if (!this.editMode && event.fieldName === 'species') {
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

    detectChanges() {
        this.cdr.detectChanges();
    }

    dilutionFactor() {
        return this.form.get('verdunningsFactor');
    }

    private addTaxaValidationsForRowIndex() {
        if (!this.species().value) {
            return;
        }

        const taxaId = this.species().value.id;

        if (!taxaId) {
            return;
        }

        this.subscription.add(
            this.taxaService.getTaxon(taxaId)
                .subscribe(taxon => {
                    this.taxon = taxon;

                    this.setTaxonValidators(taxon);
                }),
        );
    }

    private setTaxonValidators(taxon: TaxonDetail) {
        this.weight().setValidators([Validators.min(0)]);
        this.weight().updateValueAndValidity();

        this.length().setValidators([Validators.min(0)]);
        this.length().updateValueAndValidity();

        const formValidators = [lengthOrWeightRequiredForIndividualMeasurement()];
        if (taxon) {
            formValidators.push(valueBetweenWarning('weight', taxon.weightMin, taxon.weightMax, this.cdr),
                valueBetweenWarning('length', taxon.lengthMin, taxon.lengthMax, this.cdr));

            for (let index = 0; index < this.individualLengths().length; index++) {
                formValidators.push(valueBetweenWarning('individualLengths', taxon.weightMin, taxon.weightMax, this.cdr, index, 'length'));
            }
        }

        this.form.setValidators(formValidators);
        this.form.updateValueAndValidity();
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

    private isKeyTab(key: string) {
        return key === 'Tab';
    }

    private isLastIndex(i: number) {
        return this.items() === undefined || (i + 1) === this.items().length;
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

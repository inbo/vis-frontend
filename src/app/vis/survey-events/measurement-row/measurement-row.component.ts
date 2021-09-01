import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {SearchableSelectOption} from '../../../shared-ui/searchable-select/option';
import {map, take} from 'rxjs/operators';
import {TaxaService} from '../../../services/vis.taxa.service';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {
  AbstractControlWarn,
  lengthOrWeightRequiredForIndividualMeasurement,
  valueBetweenWarning
} from '../survey-event-measurements-create-page/survey-event-measurements-create-page.component';
import {Subscription} from 'rxjs';
import {faRulerHorizontal, faWeightHanging} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-measurement-row',
  templateUrl: './measurement-row.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeasurementRowComponent implements OnInit, OnDestroy {
  faWeightHanging = faWeightHanging;
  faRulerHorizontal = faRulerHorizontal;

  @Input() formGroupName: number;
  @Input() submitted = false;
  @Input() editMode = false;

  @Output() newline = new EventEmitter<any>();
  @Output() removeClicked = new EventEmitter<number>();
  @Output() saveClicked = new EventEmitter<any>();
  @Output() cancelClicked = new EventEmitter<any>();
  @Output() enterClicked = new EventEmitter<string>();

  form: FormGroup;
  taxons: SearchableSelectOption[] = [];

  private formArray: FormArray;
  private subscription = new Subscription();

  private fieldsOrder = [
    'species',
    'amount',
    'length',
    'weight',
    'gender',
    'afvisBeurtNumber',
    'comment'
  ];
  showIndividualLengthItems = true;

  numberMask(scale: number, min: number, max: number) {
    return {
      mask: Number,
      scale,
      signed: true,
      thousandsSeparator: '',
      radix: '.',
      min,
      max
    };
  }

  constructor(private taxaService: TaxaService, private rootFormGroup: FormGroupDirective, private formBuilder: FormBuilder,
              private cdr: ChangeDetectorRef) {

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
  }

  private addTaxaValidationsForRowIndex() {
    if (this.species().value === '') {
      return;
    }

    const taxaId = this.species().value;

    this.subscription.add(
      this.taxaService.getTaxon(taxaId)
        .subscribe(taxon => {
          this.weight().setValidators([Validators.min(0)]);
          this.weight().updateValueAndValidity();

          this.length().setValidators([Validators.min(0)]);
          this.length().updateValueAndValidity();

          this.form.setValidators([lengthOrWeightRequiredForIndividualMeasurement(),
            valueBetweenWarning('weight', taxon.weightMin, taxon.weightMax, this.cdr),
            valueBetweenWarning('length', taxon.lengthMin, taxon.lengthMax, this.cdr)]);
          this.form.updateValueAndValidity();
        })
    );
  }

  navigateOnArrow(key: string) {
    const splittedId = (event.currentTarget as HTMLElement).id.split('-');

    if (key === 'ArrowUp') {
      this.focusElement(splittedId[0], this.formGroupName - 1);
    } else if (key === 'ArrowDown') {
      this.focusElement(splittedId[0], this.formGroupName + 1);
    } else if (key === 'ArrowLeft') {
      const previousField = this.previousFieldName(splittedId[0]);
      this.focusElement(previousField, this.formGroupName);
    } else if (key === 'ArrowRight') {
      const nextField = this.nextFieldName(splittedId[0]);
      this.focusElement(nextField, this.formGroupName);
    }
  }

  getSpecies(val: string, id?: number) {
    this.taxaService.getTaxa(val, id).pipe(
      take(1),
      map(taxa => {
        return taxa.map(taxon => ({
          selectValue: taxon.id.value,
          option: taxon
        }));
      })
    ).subscribe(value => {
      this.taxons = value;
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

  weight(): AbstractControlWarn {
    return this.form.get('weight') as AbstractControlWarn;
  }

  length(): AbstractControlWarn {
    return this.form.get('length') as AbstractControlWarn;
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

  private isKeyTab(key: string) {
    return key === 'Tab';
  }

  private isLastIndex(i: number) {
    return this.items() === undefined || (i + 1) === this.items().length;
  }

  public focusElement(field: string, index: number) {
    const element = document.getElementById(field + '-' + index + (field === 'species' ? '-button' : ''));
    if (element !== null) {
      element.focus();
    }
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

  individualLengths(): FormArray {
    return this.form.get('individualLengths') as FormArray;
  }

  toGroupMeasurement() {
    this.form.get('length').patchValue(null);
    this.form.get('gender').patchValue(null);
    this.form.get('type').patchValue('GROUP_LENGTHS');

    this.individualLengths().clear();
    for (let i = 0; i < this.amount().value; i++) {
      this.individualLengths().push(this.createIndividualLength());
    }
  }

  createIndividualLength(comment?: any): FormGroup {
    return this.formBuilder.group({
      length: new FormControl('', [Validators.min(0), Validators.required]),
      comment: new FormControl(comment ?? '', Validators.max(2000))
    });
  }

  toIndividualMeasurement() {
    this.form.get('individualLengths').patchValue([]);
    this.form.get('type').patchValue(this.amount().value > 1 ? 'GROUP' : 'NORMAL');
  }

  enterPressed(fieldName: string) {
    if (!this.editMode) {
      if (this.isLastIndex(this.formGroupName)) {
        this.newline.emit(true);
        setTimeout(() => {
          const elementId = `${fieldName}-${this.formGroupName + 1}`;
          document.getElementById(elementId).focus();
        }, 0);
      } else {
        const elementId = `${fieldName}-${this.formGroupName + 1}`;
        const nextElement = document.getElementById(elementId);
        if (nextElement !== null) {
          nextElement.focus();
        }
      }
    } else {
      this.enterClicked.emit(fieldName);
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
}

import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators} from '@angular/forms';
import {TaxaService} from '../../../services/vis.taxa.service';
import {map, take} from 'rxjs/operators';
import {AbstractControlWarn, valueBetweenWarning} from '../survey-event-measurements-create-page/survey-event-measurements-create-page.component';
import {SearchableSelectOption} from '../../../shared-ui/searchable-select/option';
import {SearchableSelectComponent} from '../../../shared-ui/searchable-select/searchable-select.component';

@Component({
  selector: 'app-measurement-group-row',
  templateUrl: './measurement-group-row.component.html'
})
export class MeasurementGroupRowComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(SearchableSelectComponent) taxaSearchComponent: SearchableSelectComponent;
  @Input() formGroupName: number;
  @Input() submitted = false;

  @Output() newline = new EventEmitter<any>();
  @Output() removeClicked = new EventEmitter<number>();

  form: FormGroup;
  taxons: SearchableSelectOption[] = [];
  showIndividualLengthItems = true;

  private subscription = new Subscription();
  private itemsFormArray: FormArray;

  private fieldsOrder = [
    'species',
    'amount',
    'weight',
    'afvisBeurtNumber',
    'comment'
  ];

  private individualFieldsOrder = [
    'individuallength',
    'individualcomment'
  ];


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

  constructor(private taxaService: TaxaService, private rootFormGroup: FormGroupDirective, private formBuilder: FormBuilder) {

  }

  ngAfterViewInit(): void {
    this.focusElement('species', this.formGroupName);
  }

  ngOnInit(): void {
    this.itemsFormArray = this.rootFormGroup.control.get('items') as FormArray;
    this.form = this.itemsFormArray.at(this.formGroupName) as FormGroup;

    for (let i = 0; i < this.amount().value; i++) {
      this.individualLengths().push(this.createIndividualLength());
    }
    this.getSpecies(null, this.species().value);

    this.addTaxaValidationsForRowIndex();
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
          this.individualLengths().controls.forEach(value => {
            value.get('length').setValidators(
              [Validators.min(0), Validators.required,
                valueBetweenWarning(taxon.lengthMin, taxon.lengthMax)]
            );
            value.get('length').updateValueAndValidity();
          });
        })
    );
  }

  navigateOnArrow(event: KeyboardEvent) {
    this.navigate(event, this.formGroupName, this.fieldsOrder);
  }

  navigateIndividualOnArrow(event: KeyboardEvent, i: number) {
    this.navigate(event, i, this.individualFieldsOrder);
  }

  private navigate(event: KeyboardEvent, i: number, fieldNames: string[]) {
    const splittedId = (event.currentTarget as HTMLElement).id.split('-');

    if (event.ctrlKey && this.isKeyArrowUp(event.key)) {
      event.preventDefault();
      this.focusElement(splittedId[0], i - 1);
    } else if (event.ctrlKey && this.isKeyArrowDown(event.key)) {
      event.preventDefault();
      this.focusElement(splittedId[0], i + 1);
    } else if (event.ctrlKey && this.isKeyArrowLeft(event.key)) {
      const previousField = this.previousFieldName(splittedId[0], fieldNames);
      this.focusElement(previousField, i);
    } else if (event.ctrlKey && this.isKeyArrowRight(event.key)) {
      const nextField = this.nextFieldName(splittedId[0], fieldNames);
      this.focusElement(nextField, i);
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
    ).subscribe(value => this.taxons = value);
  }

  amountChanged($event: Event) {
    const val = ($event.target as HTMLInputElement).value;
    if (val && val !== '1') {
      this.length().reset();
    }
  }

  remove() {
    this.removeClicked.emit(this.formGroupName);
  }

  removeIndividualLength(i: number) {
    this.individualLengths().removeAt(i);
    this.amount().patchValue(this.individualLengths().value.length);
  }

  items() {
    return this.itemsFormArray;
  }

  onKeyPress(event: KeyboardEvent) {
    if (this.isKeyTab(event.key) && this.isLastIndex(this.formGroupName)) {
      this.newline.emit(true);
    }
  }

  newLengthOnTab(event: KeyboardEvent, i: number) {
    if (this.isKeyTab(event.key) && this.isLastIndex(i)) {
      this.individualLengths().push(this.createIndividualLength());
      this.amount().patchValue(this.individualLengths().value.length);
    }
  }

  newLineOnEnter(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      if (this.items() === undefined || (this.formGroupName + 1) === this.items().length) {
        this.newline.emit(true);
        setTimeout(() => {
          const elementId = `${(event.target as Element).id.split('-')[0]}-${this.formGroupName + 1}`;
          document.getElementById(elementId).focus();
        }, 0);
      }
    }
  }

  focusNextLineOnEnter(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const splittedId = (event.currentTarget as HTMLElement).id.split('-');
      const nextElement = document.getElementById(splittedId[0] + '-' + (this.formGroupName + 1));
      if (nextElement !== null) {
        nextElement.focus();
      }
    }

  }

  createIndividualLength(comment?: any): FormGroup {
    return this.formBuilder.group({
      length: new FormControl('', [Validators.min(0)]),
      comment: new FormControl(comment ?? '', Validators.max(2000))
    });
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

  amount(): AbstractControl {
    return this.form.get('amount');
  }

  gender(): AbstractControl {
    return this.form.get('gender');
  }

  comment(): AbstractControl {
    return this.form.get('comment');
  }

  individualLengths(): FormArray {
    return this.form.get('individualLengths') as FormArray;
  }

  individualLength(i: number): AbstractControlWarn {
    return this.individualLengths().at(i).get('length') as AbstractControlWarn;
  }

  individualComment(i: number): AbstractControl {
    return this.individualLengths().at(i).get('comment');
  }

  private isKeyTab(key: string) {
    return key === 'Tab';
  }

  private isKeyArrowUp(key: string) {
    return key === 'ArrowUp';
  }

  private isKeyArrowDown(key: string) {
    return key === 'ArrowDown';
  }

  private isKeyArrowLeft(key: string) {
    return key === 'ArrowLeft';
  }

  private isKeyArrowRight(key: string) {
    return key === 'ArrowRight';
  }

  private isLastIndex(i: number) {
    return this.individualLengths() === undefined || (i + 1) === this.individualLengths().length;
  }

  private focusElement(field: string, index: number) {
    const element = document.getElementById(field + '-' + index + (field === 'species' ? '-button' : ''));
    if (element !== null) {
      element.focus();
    }
  }

  private previousFieldName(currentFieldName: string, fieldNames: string[]) {
    let nextId = fieldNames.indexOf(currentFieldName) - 1;
    if (nextId < 0) {
      nextId = 0;
    }

    return fieldNames[nextId];
  }

  private nextFieldName(currentFieldName: string, fieldNames: string[]) {
    let nextId = fieldNames.indexOf(currentFieldName) + 1;
    if (nextId > fieldNames.length - 1) {
      nextId = fieldNames.length - 1;
    }

    return fieldNames[nextId];
  }

  message() {
    const name = this.taxaSearchComponent?.selectedValueOption?.option.nameDutch;
    const amount = this.amount().value;
    const weight = this.weight().value;

    if (name && amount && weight) {
      return `Groepsmeting van ${name}, ${amount} lengtemetingen met een totaal gewicht van ${weight}`;
    }

    return 'Onvolledige groepsmeting';
  }

  toIndividualMeasurement() {
    this.form.get('individualLengths').patchValue([]);
    this.form.get('type').patchValue('NORMAL');
  }
}

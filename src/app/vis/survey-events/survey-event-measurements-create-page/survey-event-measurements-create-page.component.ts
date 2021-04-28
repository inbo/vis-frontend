import {AfterViewChecked, Component, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {fromEvent, Observable, Subject, Subscription} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {Option} from '../../../shared-ui/searchable-select/option';
import {AlertService} from '../../../_alert';
import {SurveyEventsService} from '../../../services/vis.surveyevents.service';
import {TaxaService} from '../../../services/vis.taxa.service';
import {TipsService} from '../../../services/vis.tips.service';
import {Tip} from '../../../domain/tip/tip';
import {Measurement} from '../../../domain/survey-event/measurement';

export interface AbstractControlWarn extends AbstractControl {
  warnings: any;
}

export function valueBetweenWarning(min: number, max: number): ValidatorFn {
  return (c: AbstractControlWarn): { [key: string]: any } => {
    c.warnings = null;

    if (!c.value) {
      return null;
    }

    if (min !== null && max !== null) {
      const isValid = c.value > max || c.value < min;
      c.warnings = isValid ? {between: {value: c.value, min, max}} : null;
    }

    return null;
  };
}

export function lengthRequiredForIndividualMeasurement(): ValidatorFn {
  return (c: AbstractControl): { [key: string]: any } => {
    if (c.parent?.get('amount').value === 1 && !c.value) {
      return {lengthRequiredForIndividualMeasurement: true};
    }

    return null;
  };
}

@Component({
  selector: 'app-survey-event-measurements-create-page',
  templateUrl: './survey-event-measurements-create-page.component.html'
})
export class SurveyEventMeasurementsCreatePageComponent implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChildren('lines') lines: QueryList<HTMLDivElement>;

  // TODO species$ per measurement? Currently the searchable select for every measurements species uses the same species observable
  species$ = new Subject<Option[]>();
  tip$: Observable<Tip>;

  existingMeasurements: Measurement[];
  measurementsForm: FormGroup;
  submitted = false;
  showExistingMeasurements = false;
  loading = false;

  private scrollIntoView = false;
  private subscription = new Subscription();

  fieldsOrder = [
    'species',
    'amount',
    'length',
    'weight',
    'gender',
    'afvisBeurtNumber',
    'comment'
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

  constructor(private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private surveyEventsService: SurveyEventsService,
              private alertService: AlertService, private taxaService: TaxaService, private router: Router,
              private tipsService: TipsService) {
  }

  ngOnInit(): void {
    this.tip$ = this.tipsService.randomTipForPage('METING');
    this.measurementsForm = this.formBuilder.group({
      items: this.formBuilder.array([this.createMeasurementFormGroup()])
    });

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
        })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngAfterViewChecked() {
    if (this.scrollIntoView) {
      document.getElementById('species-' + (this.items().length - 1))?.scrollIntoView();
      this.scrollIntoView = false;
    }
  }

  addNewLine() {
    this.items().push(this.createMeasurementFormGroup(this.getPreviousSpecies(), this.getPreviousGender(), this.getPreviousAfvisbeurt(),
      this.getPreviousComment()));
    this.addTaxaValidationsForRowIndex(this.items().length - 1);
    this.scrollIntoView = true;
  }

  createMeasurementFormGroup(species?: any, gender?: any, afvisbeurt?: any, comment?: any): FormGroup {
    return this.formBuilder.group({
      species: new FormControl(species ?? '', [Validators.required]),
      amount: new FormControl(1, Validators.min(0)),
      length: new FormControl('', [Validators.min(0), lengthRequiredForIndividualMeasurement()]),
      weight: new FormControl('', [Validators.required, Validators.min(0)]),
      gender: new FormControl(gender ?? 'UNKNOWN', Validators.required),
      afvisBeurtNumber: new FormControl(afvisbeurt ?? 1, [Validators.min(1), Validators.max(10)]),
      comment: new FormControl(comment ?? '', Validators.max(2000))
    });
  }

  getSpecies(val: string) {
    this.taxaService.getTaxa(val).pipe(
      map(taxa => {
        return taxa.map(taxon => ({
          id: taxon.id.value,
          translateKey: `taxon.id.${taxon.id.value}`
        }));
      })
    ).subscribe(value => this.species$.next(value));
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
    console.log(this.measurementsForm.errors);
    if (this.measurementsForm.invalid) {
      this.submitted = true;
      return;
    }

    const measurements = this.measurementsForm.getRawValue();

    measurements.items.map(val => {
      val.taxonId = val.species.id;
      delete val.species;
      return val;
    });

    this.subscription.add(this.surveyEventsService.createMeasurements(measurements, this.activatedRoute.parent.snapshot.params.projectCode,
      this.activatedRoute.parent.snapshot.params.surveyEventId)
      .subscribe(value => {
        if (value?.code === 400) {
          this.alertService.error('Validatie fouten', 'Het bewaren is niet gelukt, controleer alle gegevens of contacteer een verantwoordelijke.');
        } else {
          this.router.navigate(['/projecten', this.activatedRoute.parent.snapshot.params.projectCode, 'waarnemingen',
            this.activatedRoute.parent.snapshot.params.surveyEventId, 'metingen']).then();
        }
      }));
  }

  newLineOnEnter(event: KeyboardEvent, i: number) {
    if (event.key === 'Enter') {
      if (this.items() === undefined || (i + 1) === this.items().length) {
        this.addNewLine();
      }
      setTimeout(() => {
        // @ts-ignore
        const elementId = `${(event.target as Element).id.split('-')[0]}-${i + 1}`;
        document.getElementById(elementId).focus();
      }, 0);
    }

  }

  focusNextLineOnEnter(event: KeyboardEvent, i: number) {
    if (event.key === 'Enter') {
      const splittedId = (event.currentTarget as HTMLElement).id.split('-');
      const nextElement = document.getElementById(splittedId[0] + '-' + (i + 1));
      if (nextElement !== null) {
        nextElement.focus();
      }
    }
  }

  navigateOnArrow(event: KeyboardEvent, i: number) {
    const splittedId = (event.currentTarget as HTMLElement).id.split('-');

    if (event.ctrlKey && this.isKeyArrowUp(event.key)) {
      event.preventDefault();
      this.focusElement(splittedId[0], i - 1);
    } else if (event.ctrlKey && this.isKeyArrowDown(event.key)) {
      event.preventDefault();
      this.focusElement(splittedId[0], i + 1);
    } else if (event.ctrlKey && this.isKeyArrowLeft(event.key)) {
      const nextField = this.previousFieldName(splittedId[0]);
      this.focusElement(nextField, i);
    } else if (event.ctrlKey && this.isKeyArrowRight(event.key)) {
      const nextField = this.nextFieldName(splittedId[0]);
      this.focusElement(nextField, i);
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

  private focusElement(field: string, index: number) {
    const element = document.getElementById(field + '-' + index);
    if (element !== null) {
      element.focus();
    }
  }

  remove(i: number) {
    if (this.items().length === 1) {
      this.alertService.warn('Opgelet', 'De laatste meting kan niet verwijdert worden.');
      return;
    }
    this.items().removeAt(i);
  }

  onSpeciesChange(index: number) {
    this.addTaxaValidationsForRowIndex(index);
  }

  private addTaxaValidationsForRowIndex(index: number) {
    if (this.species(index).value === '') {
      return;
    }

    const taxaId = this.species(index).value.id;

    this.subscription.add(
      this.taxaService.getTaxon(taxaId)
        .subscribe(taxon => {
          this.weight(index).setValidators([Validators.required, Validators.min(0), valueBetweenWarning(taxon.weightMin, taxon.weightMax)]);
          this.weight(index).updateValueAndValidity();

          this.length(index).setValidators([Validators.min(0), lengthRequiredForIndividualMeasurement(),
            valueBetweenWarning(taxon.lengthMin, taxon.lengthMax)]);
          this.length(index).updateValueAndValidity();
        })
    );
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

  amountChanged($event: Event, i: number) {
    const val = ($event.target as HTMLInputElement).value;
    if (val && val !== '1') {
      this.length(i).reset();
    }
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
}

import {AfterViewChecked, Component, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
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
export class SurveyEventMeasurementsCreatePageComponent implements OnInit, OnDestroy, AfterViewChecked, HasUnsavedData {

  @ViewChildren('lines') lines: QueryList<HTMLDivElement>;

  faRulerHorizontal = faRulerHorizontal;
  faWeightHanging = faWeightHanging;

  tip$: Observable<Tip>;

  existingMeasurements: Measurement[];
  measurementsForm: FormGroup;
  submitted = false;
  showExistingMeasurements = false;
  loading = false;

  private scrollIntoView = false;
  private subscription = new Subscription();

  constructor(private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private surveyEventsService: SurveyEventsService,
              private alertService: AlertService, private taxaService: TaxaService, private router: Router,
              private tipsService: TipsService, private _location: Location) {
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

  createMeasurementFormGroup(species?: any, gender?: any, afvisbeurt?: any, comment?: any): FormGroup {
    return this.formBuilder.group({
      type: new FormControl('NORMAL'),
      species: new FormControl(species ?? '', [Validators.required]),
      amount: new FormControl(1, Validators.min(0)),
      length: new FormControl('', [Validators.min(0), lengthRequiredForIndividualMeasurement()]),
      weight: new FormControl('', [Validators.required, Validators.min(0)]),
      gender: new FormControl(gender ?? 'UNKNOWN'),
      afvisBeurtNumber: new FormControl(afvisbeurt ?? 1, [Validators.min(1), Validators.max(10)]),
      comment: new FormControl(comment ?? '', Validators.max(2000)),
      individualLengths: this.formBuilder.array([])
    });
  }

  addNewLine() {
    this.items().push(this.createMeasurementFormGroup(this.getPreviousSpecies(), this.getPreviousGender(), this.getPreviousAfvisbeurt(),
      this.getPreviousComment()));
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

    this.subscription.add(this.surveyEventsService.createMeasurements(measurements, this.activatedRoute.parent.snapshot.params.projectCode,
      this.activatedRoute.parent.snapshot.params.surveyEventId)
      .subscribe(value => {
        if (value?.code === 400) {
          this.alertService.error('Validatie fouten', 'Het bewaren is niet gelukt, controleer alle gegevens of contacteer een verantwoordelijke.');
        } else {
          this.submitted = true;
          this.router.navigate(['/projecten', this.activatedRoute.parent.snapshot.params.projectCode, 'waarnemingen',
            this.activatedRoute.parent.snapshot.params.surveyEventId, 'metingen']).then();
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

  cancel() {
    this._location.back();
  }
}

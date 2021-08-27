import {Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
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
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {lengthRequiredForIndividualMeasurement} from '../survey-event-measurements-create-page/survey-event-measurements-create-page.component';
import {MeasurementRowComponent} from '../measurement-row/measurement-row.component';
import {PagingAsyncComponent} from '../../../shared-ui/paging-async/paging-async.component';
import {MeasurementRowReadonlyComponent} from '../measurement-row-readonly/measurement-row-readonly.component';

@Component({
  selector: 'app-survey-event-measurements-page',
  templateUrl: './survey-event-measurements-page.component.html'
})
export class SurveyEventMeasurementsPageComponent implements OnInit {
  @ViewChildren(MeasurementRowComponent) measurementRowComponents!: QueryList<MeasurementRowComponent>;
  @ViewChildren(MeasurementRowReadonlyComponent) measurementRowReadonlyComponents!: QueryList<MeasurementRowReadonlyComponent>;

  @ViewChild(PagingAsyncComponent) pagingComponent: PagingAsyncComponent;

  faRulerHorizontal = faRulerHorizontal;
  faWeightHanging = faWeightHanging;

  public role = Role;

  projectCode: any;
  surveyEventId: any;

  isModalOpen = false;
  loading = false;
  measurementToBeDeleted: number;
  pager: AsyncPage<Measurement>;
  measurements: Measurement[];

  surveyEvent: SurveyEvent;
  form: FormGroup;
  rowEditNumber: number;
  private rowSavedNumber: number;

  constructor(private titleService: Title, private surveyEventsService: SurveyEventsService, private activatedRoute: ActivatedRoute,
              public authService: AuthService, private formBuilder: FormBuilder) {
    this.surveyEventId = this.activatedRoute.parent.snapshot.params.surveyEventId;
    this.projectCode = this.activatedRoute.parent.snapshot.params.projectCode;
    this.titleService.setTitle('Waarneming metingen ' + this.activatedRoute.parent.snapshot.params.surveyEventId);
  }

  ngOnInit(): void {
    this.init();

    this.form = this.formBuilder.group({
      items: this.formBuilder.array([])
    });
  }

  createMeasurementFormGroup(measurement: Measurement) {
    const il = measurement.individualLengths ? measurement.individualLengths.map(value => this.createIndividualLength(value)) : [];
    return this.formBuilder.group({
      id: new FormControl(measurement.id),
      type: new FormControl(measurement.type),
      species: new FormControl(measurement.taxonId, [Validators.required]),
      amount: new FormControl(measurement.amount, Validators.min(0)),
      length: new FormControl(measurement.length ? measurement.length.toString() : '', [Validators.min(0), lengthRequiredForIndividualMeasurement()]),
      weight: new FormControl(measurement.weight ? measurement.weight.toString() : '', [Validators.required, Validators.min(0)]),
      gender: new FormControl(measurement.gender ? measurement.gender : 'UNKNOWN'),
      afvisBeurtNumber: new FormControl(measurement.afvisBeurtNumber, [Validators.min(1), Validators.max(10)]),
      comment: new FormControl(measurement.comment ? measurement.comment : '', Validators.max(2000)),
      individualLengths: this.formBuilder.array(il)
    });
  }

  createIndividualLength(individualLength: IndividualLength): FormGroup {
    return this.formBuilder.group({
      id: new FormControl(individualLength.id),
      length: new FormControl(individualLength.length, [Validators.min(0)]),
      comment: new FormControl(individualLength.comment, Validators.max(2000))
    });
  }

  items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  private init() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.loadMeasurements(params.page ? params.page : 1, params.size ? params.size : 20);
    });

    this.surveyEventsService.getSurveyEvent(this.activatedRoute.parent.snapshot.params.projectCode,
      this.activatedRoute.parent.snapshot.params.surveyEventId)
      .pipe(take(1))
      .subscribe(value => this.surveyEvent = value);
  }

  loadMeasurements(page: number, size: number) {
    this.loading = true;
    this.surveyEventsService.getMeasurements(this.projectCode, this.surveyEventId, page, size).subscribe((value) => {
      this.pager = value;
      this.measurements = value.content;
      this.loading = false;

      (this.form.get('items') as FormArray).clear();

      value.content.forEach(measurement => {
        (this.form.get('items') as FormArray).push(this.createMeasurementFormGroup(measurement));
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
    this.surveyEventsService.deleteMeasurement(this.projectCode, this.surveyEventId, this.items().at(this.measurementToBeDeleted).get('id').value)
      .pipe(take(1))
      .subscribe(() => {
        this.init();
        this.cancelModal();
      });
  }

  save(i: number) {
    const data = this.items().at(i) as FormGroup;

    this.surveyEventsService.saveMeasurement(this.projectCode, this.surveyEventId, data.get('id').value, data.getRawValue())
      .pipe(take(1))
      .subscribe(() => {
        this.rowEditNumber = null;
        this.measurementRowReadonlyComponents.get(i - 1).showSavedMessage();
      });

  }

  cancel(i: number) {
    this.items().at(i).reset(this.createMeasurementFormGroup(this.measurements[i]).getRawValue());
    this.rowEditNumber = null;
  }

  enterClicked(i: number, fieldName: string) {
    if (i + 1 === this.measurements.length) {
      this.pagingComponent.next();
    }

    const data = this.items().at(i) as FormGroup;

    if (data.invalid) {
      return;
    }

    if (!data.dirty) {
      this.rowEditNumber = i + 1;
      setTimeout(() => {
        this.measurementRowComponents.get(0).focusElement(fieldName, this.rowEditNumber);
      }, 0);
      return;
    }

    this.surveyEventsService.saveMeasurement(this.projectCode, this.surveyEventId, data.get('id').value, data.getRawValue())
      .pipe(take(1))
      .subscribe(() => {
        this.rowEditNumber = i + 1;
        setTimeout(() => {
          this.measurementRowReadonlyComponents.get(this.rowEditNumber - 1).showSavedMessage();
          this.measurementRowComponents.get(0).focusElement(fieldName, this.rowEditNumber);
        }, 0);

      });
  }
}

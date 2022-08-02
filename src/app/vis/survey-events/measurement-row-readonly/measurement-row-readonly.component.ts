import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, FormGroupDirective} from '@angular/forms';
import {Subscription} from 'rxjs';
import {TaxaService} from '../../../services/vis.taxa.service';
import {faRulerHorizontal, faWeightHanging} from '@fortawesome/free-solid-svg-icons';
import {AbstractControlWarn} from '../survey-event-measurements-create-page/survey-event-measurements-validators';
import {Role} from '../../../core/_models/role';
import {AuthService} from '../../../core/auth.service';

@Component({
  selector: 'app-measurement-row-readonly',
  templateUrl: './measurement-row-readonly.component.html'
})
export class MeasurementRowReadonlyComponent implements OnInit, OnDestroy {
  role = Role;
  faWeightHanging = faWeightHanging;
  faRulerHorizontal = faRulerHorizontal;

  @Input() formGroupName: number;
  @Input() submitted = false;
  @Input() showSaveMessage = false;

  @Output() editClicked = new EventEmitter<any>();
  @Output() removeClicked = new EventEmitter<any>();

  form: FormGroup;

  private formArray: FormArray;
  private subscription = new Subscription();

  showIndividualLengthItems = false;
  savedMessage = false;

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
              public authService: AuthService) {

  }

  ngOnInit(): void {
    this.formArray = this.rootFormGroup.control.get('items') as FormArray;
    this.form = this.formArray.at(this.formGroupName) as FormGroup;

    if (this.showSaveMessage) {
      this.showSavedMessage();
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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

  type(): AbstractControl {
    return this.form.get('type');
  }

  order(): AbstractControl {
    return this.form.get('order');
  }

  individualLengths(): FormArray {
    return this.form.get('individualLengths') as FormArray;
  }

  edit() {
    this.editClicked.emit();
  }

  remove() {
    this.removeClicked.emit();
  }

  showSavedMessage() {
    this.showSaveMessage = false;
    this.savedMessage = true;
    setTimeout(() => {
      this.savedMessage = false;
    }, 2500);
  }

  toggleIndividualMeasurement() {
    this.showIndividualLengthItems = !this.showIndividualLengthItems;
  }
}

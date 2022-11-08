import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormGroup, FormGroupDirective} from '@angular/forms';
import {MeasurementComponentDirective} from '../measurement-component.directive';
import {AbstractControlWarn} from '../../survey-event-measurements-create-page/survey-event-measurements-validators';

@Component({
  selector: 'app-measurement-length',
  templateUrl: './measurement-length.component.html'
})
export class MeasurementLengthComponent extends MeasurementComponentDirective implements OnInit {
  form: FormGroup;
  @Input() index: number;

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

  constructor(private rootFormGroup: FormGroupDirective) {
    super();
  }

  ngOnInit(): void {
    this.form = this.rootFormGroup.form;
  }

  length(): AbstractControlWarn {
    return this.form.get('length') as AbstractControlWarn;
  }

  amount(): AbstractControl {
    return this.form.get('amount');
  }

  fieldName(): string {
    return 'length';
  }
}

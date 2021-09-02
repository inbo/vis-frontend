import {Component, Input, OnInit} from '@angular/core';
import {FormGroup, FormGroupDirective} from '@angular/forms';
import {MeasurementComponentDirective} from '../measurement-component.directive';
import {AbstractControlWarn} from '../../survey-event-measurements-create-page/survey-event-measurements-validators';

@Component({
  selector: 'app-measurement-weight',
  templateUrl: './measurement-weight.component.html'
})
export class MeasurementWeightComponent extends MeasurementComponentDirective implements OnInit {

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

  weight(): AbstractControlWarn {
    return this.form.get('weight') as AbstractControlWarn;
  }

  fieldName(): string {
    return 'weight';
  }
}

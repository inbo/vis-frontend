import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormGroup, FormGroupDirective} from '@angular/forms';
import {MeasurementComponentDirective} from '../measurement-component.directive';
import {AbstractControlWarn} from '../../survey-event-measurements-create-page/survey-event-measurements-validators';

@Component({
  selector: 'app-measurement-gender',
  templateUrl: './measurement-gender.component.html'
})
export class MeasurementGenderComponent extends MeasurementComponentDirective implements OnInit {

  form: FormGroup;
  @Input() index: number;

  constructor(private rootFormGroup: FormGroupDirective) {
    super();
  }

  ngOnInit(): void {
    this.form = this.rootFormGroup.form;
  }

  navigateOnArrow($event: KeyboardEvent) {

  }

  amount(): AbstractControl {
    return this.form.get('amount');
  }

  length(): AbstractControlWarn {
    return this.form.get('length') as AbstractControlWarn;
  }

  fieldName(): string {
    return 'gender';
  }
}

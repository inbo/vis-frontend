import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormGroupDirective, UntypedFormGroup} from '@angular/forms';
import {MeasurementComponentDirective} from '../measurement-component.directive';
import {WarningFormControl} from '../../../../shared-ui/warning-form-control/warning.form-control';

@Component({
  selector: 'app-measurement-gender',
  templateUrl: './measurement-gender.component.html'
})
export class MeasurementGenderComponent extends MeasurementComponentDirective implements OnInit {

  form: UntypedFormGroup;
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

  length(): WarningFormControl {
    return this.form.get('length') as WarningFormControl;
  }

  fieldName(): string {
    return 'gender';
  }
}

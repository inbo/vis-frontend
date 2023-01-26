import {Component, Input, OnInit} from '@angular/core';
import {FormGroupDirective, UntypedFormGroup} from '@angular/forms';
import {MeasurementComponentDirective} from '../measurement-component.directive';

@Component({
  selector: 'app-measurement-fishing-trip-number',
  templateUrl: './measurement-fishing-trip-number.component.html'
})
export class MeasurementFishingTripNumberComponent extends MeasurementComponentDirective implements OnInit {

  form: UntypedFormGroup;

  @Input() index: number;

  constructor(private rootFormGroup: FormGroupDirective) {
    super();
  }

  ngOnInit(): void {
    this.form = this.rootFormGroup.form;
  }

  fieldName(): string {
    return 'afvisBeurtNumber';
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {FormGroup, FormGroupDirective} from '@angular/forms';
import {MeasurementComponentDirective} from '../measurement-component.directive';

@Component({
  selector: 'app-measurement-fishing-trip-number',
  templateUrl: './measurement-fishing-trip-number.component.html'
})
export class MeasurementFishingTripNumberComponent extends MeasurementComponentDirective implements OnInit {

  form: FormGroup;
  @Input() index: number;

  constructor(private rootFormGroup: FormGroupDirective) {
    super();
  }

  ngOnInit(): void {
    this.form = this.rootFormGroup.form;
  }

  amountChanged($event: Event) {

  }

  newLineOnEnter($event: KeyboardEvent) {

  }

  focusNextLineOnEnter($event: KeyboardEvent) {

  }

  navigateOnArrow($event: KeyboardEvent) {

  }

  fieldName(): string {
    return 'afvisBeurtNumber';
  }

}

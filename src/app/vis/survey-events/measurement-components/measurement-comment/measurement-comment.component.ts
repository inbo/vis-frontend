import {Component, Input, OnInit} from '@angular/core';
import {FormGroup, FormGroupDirective} from '@angular/forms';
import {MeasurementComponentDirective} from '../measurement-component.directive';

@Component({
  selector: 'app-measurement-comment',
  templateUrl: './measurement-comment.component.html'
})
export class MeasurementCommentComponent extends MeasurementComponentDirective implements OnInit {

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

  onKeyPress($event: KeyboardEvent) {

  }
  fieldName(): string {
    return 'comment';
  }
}

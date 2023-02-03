import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, ValidationErrors} from '@angular/forms';

@Component({
  selector: 'vis-form-error-message',
  templateUrl: './form-error-message.component.html'
})
export class FormErrorMessageComponent implements OnInit {
  @Input()
  control: AbstractControl;

  @Input()
  submitted = false;
  @Input()
  showAfterSubmitted = false;
  @Input()
  fieldName: string;


  constructor() {
  }

  ngOnInit(): void {
  }

  displayErrorMessage() {
    if (this.control?.errors) {
      return (this.showAfterSubmitted && this.submitted) || (!this.showAfterSubmitted && (this.submitted ||
        (this.control.dirty || this.control.touched))) && this.control.invalid;
    }

    return false;
  }

  errorKeys() {
    return Object.keys(this.control.errors);
  }

  errorParams(error: string) {
    const params: ValidationErrors = this.control.errors[error];

    const result = {
      fieldName: this.fieldName
    };

    for (const [key, value] of Object.entries(params)) {
      result[key] = value;
    }

    return result;
  }

}

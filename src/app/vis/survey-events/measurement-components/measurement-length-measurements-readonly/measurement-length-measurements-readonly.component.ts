import {Component, Input, OnInit} from '@angular/core';
import {
    AbstractControl,
    FormGroupDirective,
    UntypedFormArray,
    UntypedFormBuilder,
    UntypedFormControl,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import {WarningFormControl} from '../../../../shared-ui/warning-form-control/warning.form-control';

@Component({
  selector: 'vis-measurement-length-measurements-readonly',
  templateUrl: './measurement-length-measurements-readonly.component.html'
})
export class MeasurementLengthMeasurementsReadonlyComponent implements OnInit {

  form: UntypedFormGroup;
  @Input() index: number;
  @Input() submitted = false;

  private individualFieldsOrder = [
    'individuallength',
    'individualcomment'
  ];

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

  constructor(private rootFormGroup: FormGroupDirective, private formBuilder: UntypedFormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.rootFormGroup.form;
  }

  type(): AbstractControl {
    return this.form.get('type');
  }

  amount(): AbstractControl {
    return this.form.get('amount');
  }

  individualLengths(): UntypedFormArray {
    return this.form.get('individualLengths') as UntypedFormArray;
  }

  individualLength(i: number): WarningFormControl {
    return this.individualLengths().at(i).get('length') as WarningFormControl;
  }

  individualComment(i: number): AbstractControl {
    return this.individualLengths().at(i).get('comment');
  }

  removeIndividualLength(i: number) {
    this.individualLengths().removeAt(i);

    this.amount().setValidators(Validators.min(this.individualLengths().length));
  }

  newLengthOnTab(event: KeyboardEvent, i: number) {
    if (this.isKeyTab(event.key) && this.isLastIndex(i)) {
      this.addIndividualLength();
    }
  }

  private addIndividualLength() {
    const individualLengthsSize = this.individualLengths().value.length;
    if (individualLengthsSize < this.amount().value) {
      this.individualLengths().push(this.createIndividualLength());
      this.amount().setValidators(Validators.min(individualLengthsSize + 1));
    }
  }

  private isLastIndex(i: number) {
    return this.individualLengths() === undefined || (i + 1) === this.individualLengths().length;
  }

  createIndividualLength(comment?: any): UntypedFormGroup {
    return this.formBuilder.group({
      length: new UntypedFormControl('', [Validators.min(0), Validators.required]),
      comment: new UntypedFormControl(comment ?? '', Validators.maxLength(2000))
    });
  }

  onEnter(event: KeyboardEvent, i: number) {
    if (event.key === 'Enter') {
      if (this.individualLengths().length === (i + 1)) {
        this.addIndividualLength();

        const splittedId = (event.currentTarget as HTMLElement).id.split('-');
        setTimeout(() => {
          const nextElement = document.getElementById(splittedId[0] + '-' + (i + 1));
          nextElement?.focus();
        }, 0);
      } else {
        const splittedId = (event.currentTarget as HTMLElement).id.split('-');
        const nextElement = document.getElementById(splittedId[0] + '-' + (i + 1));
        nextElement.focus();
      }
    }
  }

  navigateIndividualOnArrow(event: KeyboardEvent, i: number) {
    this.navigate(event, i, this.individualFieldsOrder);
  }

  private navigate(event: KeyboardEvent, i: number, fieldNames: string[]) {
    const splittedId = (event.currentTarget as HTMLElement).id.split('-');

    if (event.ctrlKey && this.isKeyArrowUp(event.key)) {
      event.preventDefault();
      this.focusElement(splittedId[0], i - 1);
    } else if (event.ctrlKey && this.isKeyArrowDown(event.key)) {
      event.preventDefault();
      this.focusElement(splittedId[0], i + 1);
    } else if (event.ctrlKey && this.isKeyArrowLeft(event.key)) {
      const previousField = this.previousFieldName(splittedId[0], fieldNames);
      this.focusElement(previousField, i);
    } else if (event.ctrlKey && this.isKeyArrowRight(event.key)) {
      const nextField = this.nextFieldName(splittedId[0], fieldNames);
      this.focusElement(nextField, i);
    }
  }

  private previousFieldName(currentFieldName: string, fieldNames: string[]) {
    let nextId = fieldNames.indexOf(currentFieldName) - 1;
    if (nextId < 0) {
      nextId = 0;
    }

    return fieldNames[nextId];
  }

  private isKeyArrowUp(key: string) {
    return key === 'ArrowUp';
  }

  private isKeyArrowDown(key: string) {
    return key === 'ArrowDown';
  }

  private isKeyArrowLeft(key: string) {
    return key === 'ArrowLeft';
  }

  private isKeyArrowRight(key: string) {
    return key === 'ArrowRight';
  }

  private focusElement(field: string, index: number) {
    const element = document.getElementById(field + '-' + index + (field === 'species' ? '-button' : ''));
    if (element !== null) {
      element.focus();
    }
  }

  private nextFieldName(currentFieldName: string, fieldNames: string[]) {
    let nextId = fieldNames.indexOf(currentFieldName) + 1;
    if (nextId > fieldNames.length - 1) {
      nextId = fieldNames.length - 1;
    }

    return fieldNames[nextId];
  }

  private isKeyTab(key: string) {
    return key === 'Tab';
  }

}

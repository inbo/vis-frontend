import {ChangeDetectorRef} from '@angular/core';
import {AbstractControl, FormGroup, ValidatorFn} from '@angular/forms';

export interface AbstractControlWarn extends AbstractControl {
  warnings: any;
}

export function valueBetweenWarning(fieldName: string, minVal: number, maxVal: number, cdr: ChangeDetectorRef): ValidatorFn {
  return (c: FormGroup) => {
    const field = c.get(fieldName) as AbstractControlWarn;
    field.warnings = null;

    if (!field.value) {
      return null;
    }

    const min = minVal * c.get('amount').value;
    const max = maxVal * c.get('amount').value;

    if (minVal !== null && maxVal !== null) {
      const isValid = field.value > max || field.value < min;
      field.warnings = isValid ? {between: {value: field.value, min, max}} : null;
      cdr.detectChanges();
    }

    return null;
  };
}

export function lengthOrWeightRequiredForIndividualMeasurement(): ValidatorFn {
  return (c: AbstractControl) => {
    if (c.get('amount').value === 1 && (!c.get('length').value && !c.get('weight').value)) {
      return {lengthOrWeightRequiredForIndividualMeasurement: true};
    }

    return null;
  };
}

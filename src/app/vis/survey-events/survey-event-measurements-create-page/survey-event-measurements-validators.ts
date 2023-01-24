import {ChangeDetectorRef} from '@angular/core';
import {AbstractControl, UntypedFormArray, UntypedFormGroup, ValidatorFn} from '@angular/forms';

export interface AbstractControlWarn extends AbstractControl {
  warnings: any;
}

export function valueBetweenWarning(fieldName: string, minVal: number, maxVal: number,
                                    cdr: ChangeDetectorRef, index?: number, affix?: string): ValidatorFn {
  return (c: UntypedFormGroup) => {
    let field = c.get(fieldName) as AbstractControlWarn;
    const isArrayElement = !isNaN(index) && affix;
    if (isArrayElement) {
      const array = (c.get(fieldName) as UntypedFormArray);
      if (array.length === 0 || array.length === index) {
        return null;
      }

      if (!array.at(index)) {
        return;
      }

      field = array.at(index).get(affix) as AbstractControlWarn;
    }

    field.warnings = null;

    if (!field.value) {
      return null;
    }

    const min = isArrayElement ? minVal : minVal * c.get('amount').value;
    const max = isArrayElement ? maxVal : maxVal * c.get('amount').value;

    if (minVal !== null && maxVal !== null) {
      const isValid = field.value > max || field.value < min;
      field.warnings = isValid ? {between: {value: field.value, min, max}} : null;
      cdr.detectChanges();
    }

    return null;
  };
}

// export function lengthWeightRatio(taxon: TaxonDetail): ValidatorFn {
//   return (c: FormGroup) => {
//     let field = c.get(fieldName) as AbstractControlWarn;
//     const isArrayElement = !isNaN(index) && affix;
//     if (isArrayElement) {
//       const array = (c.get(fieldName) as FormArray);
//       if (array.length === 0 || array.length === index) {
//         return null;
//       }
//
//       if (!array.at(index)) {
//         return;
//       }
//
//       field = array.at(index).get(affix) as AbstractControlWarn;
//     }
//
//     field.warnings = null;
//
//     if (!field.value) {
//       return null;
//     }
//
//     const min = isArrayElement ? minVal : minVal * c.get('amount').value;
//     const max = isArrayElement ? maxVal : maxVal * c.get('amount').value;
//
//     if (minVal !== null && maxVal !== null) {
//       const isValid = field.value > max || field.value < min;
//       field.warnings = isValid ? {between: {value: field.value, min, max}} : null;
//       cdr.detectChanges();
//     }
//
//     return null;
//   };
// }

export function lengthOrWeightRequiredForIndividualMeasurement(): ValidatorFn {
  return (c: AbstractControl) => {
    if (c.get('amount').value === 1 && (!c.get('length').value && !c.get('weight').value)) {
      return {lengthOrWeightRequiredForIndividualMeasurement: true};
    }

    return null;
  };
}

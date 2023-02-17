import {FormGroup, ValidatorFn} from '@angular/forms';
import {isNil} from 'lodash-es';
import {ChangeDetectorRef} from '@angular/core';

export const measurementWeightValidator = (changeDetectorRef: ChangeDetectorRef): ValidatorFn => {
    return (measurementFormGroup: FormGroup) => {
        const amountFormControl = measurementFormGroup.get('amount');
        const weightFormControl = measurementFormGroup.get('weight');
        const lengthFormControl = measurementFormGroup.get('length');

        if (isNil(amountFormControl) || isNil(weightFormControl) || isNil(lengthFormControl)) {
            return null;
        }

        const amount = amountFormControl.value;
        const weight = weightFormControl.value;
        const length = lengthFormControl.value;

        let errors = null;

        let lengthIsFilledIn = !isNil(length) && length !== '';
        let amountIsGreaterThan1 = amount > 1;
        let weightIsNotFilledIn = isNil(weight) || weight === '';
        if (amountIsGreaterThan1 && lengthIsFilledIn && weightIsNotFilledIn) {
            errors = {
                measurementWeight: true,
            };

        }

        weightFormControl.setErrors(errors);
        changeDetectorRef.detectChanges();
        return errors;
    };
};

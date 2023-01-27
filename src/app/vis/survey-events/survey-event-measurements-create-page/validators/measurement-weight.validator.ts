import {FormGroup, ValidatorFn} from '@angular/forms';
import {isNil} from 'lodash-es';
import {ChangeDetectorRef} from '@angular/core';

export const measurementWeightValidator = (changeDetectorRef: ChangeDetectorRef): ValidatorFn => {
    return (measurementFormGroup: FormGroup) => {
        const amountFormControl = measurementFormGroup.get('amount');
        const weightFormControl = measurementFormGroup.get('weight');

        if (isNil(amountFormControl) || isNil(weightFormControl)) {
            return null;
        }

        const amount = amountFormControl.value;
        const weight = weightFormControl.value;

        let errors = null;

        if (amount > 1 && isNil(weight)) {
            errors = {
                measurementWeight: true,
            };

        }

        weightFormControl.setErrors(errors);
        changeDetectorRef.detectChanges();
        return errors;
    };
};

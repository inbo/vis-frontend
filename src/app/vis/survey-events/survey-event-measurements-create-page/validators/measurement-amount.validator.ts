import {FormGroup, ValidatorFn} from '@angular/forms';
import {isNil} from 'lodash-es';
import {ChangeDetectorRef} from '@angular/core';

export const measurementAmountValidator = (changeDetectorRef: ChangeDetectorRef): ValidatorFn => {
    return (measurementFormGroup: FormGroup) => {

        const lengthFormControl = measurementFormGroup.get('length');
        const amountFormControl = measurementFormGroup.get('amount');

        if (isNil(lengthFormControl) || isNil(amountFormControl)) {
            return null;
        }

        const amount = amountFormControl.value;
        const length = lengthFormControl?.value;

        let errors = null;
        if (!amount && !isNil(length)) {
            errors = {
                measurementAmount: true,
            };
        }

        amountFormControl.setErrors(errors);
        changeDetectorRef.detectChanges();
        return errors;
    };
};

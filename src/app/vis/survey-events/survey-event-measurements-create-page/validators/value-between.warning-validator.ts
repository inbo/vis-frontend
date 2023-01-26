import {ChangeDetectorRef} from '@angular/core';
import {ValidatorFn} from '@angular/forms';
import {WarningFormControl} from '../../../../shared-ui/warning-form-control/warning.form-control';
import {isNil} from 'lodash-es';

export function valueBetweenWarning(minVal: number, maxVal: number, cdr: ChangeDetectorRef): ValidatorFn {
    return (formControl: WarningFormControl) => {
        delete formControl?.warningMessages?.between;

        const actualValue = formControl.value;
        if (isNil(actualValue) || isNil(minVal) || isNil(maxVal)) {
            return null;
        }

        const isinValid = actualValue > maxVal || actualValue < minVal;
        formControl.warningMessages = {
            ...(formControl.warningMessages || {}),
            ...(isinValid ? {between: `Waarde moet tussen ${minVal} en ${maxVal} liggen.`} : {}),
        };
        cdr.detectChanges();

        return null;
    };
}

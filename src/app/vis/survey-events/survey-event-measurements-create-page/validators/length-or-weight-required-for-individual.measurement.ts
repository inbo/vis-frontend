import {AbstractControl, ValidatorFn} from '@angular/forms';

export function lengthOrWeightRequiredForIndividualMeasurement(): ValidatorFn {
    return (c: AbstractControl) => {
        if (c.get('amount').value === 1 && (!c.get('length').value && !c.get('weight').value)) {
            return {lengthOrWeightRequiredForIndividualMeasurement: true};
        }

        return null;
    };
}

import {ChangeDetectorRef} from '@angular/core';
import {FormGroup, ValidatorFn} from '@angular/forms';
import {WarningFormControl} from '../../../../../shared-ui/warning-form-control/warning.form-control';
import {isNil} from 'lodash-es';
import {TaxonDetail} from '../../../../../domain/taxa/taxon-detail';

export function weightBetweenWarning(taxon: TaxonDetail, cdr: ChangeDetectorRef): ValidatorFn {
    return (formControl: FormGroup) => {
        const weightControl = formControl.get('weight') as WarningFormControl;
        const amountControl = formControl.get('amount');
        delete weightControl?.warningMessages?.weightBetween;

        const actualAmount = amountControl?.value;

        if (isNil(taxon)
            || isNil(actualAmount)
            || actualAmount === ''
            || isNil(weightControl.value)
            || weightControl.value === ''
            || isNil(taxon.weightMin)
            || isNil(taxon.weightMax)) {
            return null;
        }

        const minWeight = actualAmount * taxon.weightMin;
        const maxWeight = actualAmount * taxon.weightMax;
        const actualWeight = weightControl.value;
        const isinValid = actualWeight > maxWeight || actualWeight < minWeight;
        weightControl.warningMessages = {
            ...(weightControl.warningMessages || {}),
            ...(isinValid ? {weightBetween: `Waarde moet tussen ${minWeight} en ${maxWeight} liggen.`} : {}),
        };
        cdr.detectChanges();

        return null;
    };
}

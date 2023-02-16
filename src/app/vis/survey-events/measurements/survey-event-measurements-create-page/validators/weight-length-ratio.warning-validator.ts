import {ChangeDetectorRef} from '@angular/core';
import {FormGroup, ValidatorFn} from '@angular/forms';
import {TaxonDetail} from '../../../../../domain/taxa/taxon-detail';
import {isNil} from 'lodash-es';
import {WarningFormControl} from '../../../../../shared-ui/warning-form-control/warning.form-control';

export function weightLengthRatioValidator(taxon: TaxonDetail, cdr: ChangeDetectorRef): ValidatorFn {
    return (formGroup: FormGroup) => {
        const weightField = formGroup.get('weight') as WarningFormControl;
        const weight = weightField.value;
        const length = formGroup.get('length').value;
        const amount = formGroup.get('amount').value;


        if (isNil(amount)
            || amount > 1
            || isNil(length)
            || isNil(weight)
            || isNil(taxon.minGewichtLengteFactor)
            || isNil(taxon.maxGewichtLengteFactor)
            || isNil(taxon.minGewichtLengteExponent)
            || isNil(taxon.maxGewichtLengteExponent)) {
            delete weightField?.warningMessages?.ratio;
            return null;
        }

        const minWeight = taxon.minGewichtLengteFactor * Math.pow(length, taxon.minGewichtLengteExponent) + (taxon.minGewichtLengteConstante ?? 0);
        const maxWeight = taxon.maxGewichtLengteFactor * Math.pow(length, taxon.maxGewichtLengteExponent) + (taxon.maxGewichtLengteConstante ?? 0);

        const isNotWithinRatio = weight < minWeight ||   weight > maxWeight;
        delete weightField?.warningMessages?.ratio;
        weightField.warningMessages = {
            ...(weightField.warningMessages || {}),
            ...(isNotWithinRatio ? {ratio: `Het gewicht is niet in verhouding met de ingevoerde lengte.`} : {}),
        };
        cdr.detectChanges();

        return null;
    };
}


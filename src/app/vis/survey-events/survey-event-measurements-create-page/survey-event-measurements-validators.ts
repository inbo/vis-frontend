import {ChangeDetectorRef} from '@angular/core';
import {AbstractControl, FormGroup, UntypedFormArray, UntypedFormGroup, ValidatorFn} from '@angular/forms';
import {TaxonDetail} from '../../../domain/taxa/taxon-detail';
import {isNil} from 'lodash-es';

export interface AbstractControlWarn extends AbstractControl {
    warningMessage: string;

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

        field.warningMessage = null;

        if (!field.value) {
            return null;
        }

        const min = isArrayElement ? minVal : minVal * c.get('amount').value;
        const max = isArrayElement ? maxVal : maxVal * c.get('amount').value;

        if (minVal !== null && maxVal !== null) {
            const isinValid = field.value > max || field.value < min;
            field.warningMessage = isinValid ? `Waarde moet tussen ${min} en ${max} liggen.` : undefined;
            cdr.detectChanges();
        }

        return null;
    };
}

export function weightValidator(taxon: TaxonDetail, cdr: ChangeDetectorRef): ValidatorFn {
    return (formGroup: FormGroup) => {
        const weight = formGroup.get('weight').value;
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
            return null;
        }

        const minWeight = taxon.minGewichtLengteFactor * Math.pow(length, taxon.minGewichtLengteExponent) + (taxon.minGewichtLengteConstante ?? 0);
        const maxWeight = taxon.maxGewichtLengteFactor * Math.pow(length, taxon.maxGewichtLengteExponent) + (taxon.maxGewichtLengteConstante ?? 0);

        if (weight < taxon.weightMin || weight > taxon.weightMax) {
            (formGroup.get('weight') as AbstractControlWarn).warningMessage = `Het gewicht moet tussen ${taxon.weightMin} en ${taxon.weightMax} liggen.`;
        } else if (weight < minWeight || weight > maxWeight) {
            (formGroup.get('weight') as AbstractControlWarn).warningMessage = 'Het gewicht is niet in verhouding met de ingevoerde lengte.';
        }

        cdr.detectChanges();
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

import {Component, Input} from '@angular/core';
import {AbstractControl} from '@angular/forms';
import {MeasurementComponentDirective} from '../measurement-component.directive';

@Component({
    selector: 'app-measurement-amount',
    templateUrl: './measurement-amount.component.html',
})
export class MeasurementAmountComponent extends MeasurementComponentDirective {

    @Input() submitted: boolean;

    fieldName = 'amount';

    amountChanged() {
        const val = this.amount().value;
        if (val && val > 1) {
            if (this.type().value === 'NORMAL') {
                this.type().patchValue('GROUP');
                this.length().reset();
            }
        } else {
            this.type().patchValue('NORMAL');
        }
    }

    amount(): AbstractControl {
        return this.form.get('amount');
    }

    type(): AbstractControl {
        return this.form.get('type');
    }

    private length(): AbstractControl {
        return this.form.get('length');
    }
}

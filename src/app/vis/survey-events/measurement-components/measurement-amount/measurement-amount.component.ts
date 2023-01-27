import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormGroupDirective, UntypedFormGroup} from '@angular/forms';
import {MeasurementComponentDirective} from '../measurement-component.directive';

@Component({
    selector: 'app-measurement-amount',
    templateUrl: './measurement-amount.component.html',
})
export class MeasurementAmountComponent extends MeasurementComponentDirective implements OnInit {

    form: UntypedFormGroup;
    @Input() index: number;
    @Input() submitted: boolean;

    constructor(private rootFormGroup: FormGroupDirective) {
        super();
    }

    ngOnInit(): void {
        this.form = this.rootFormGroup.form;
    }

    amountChanged($event: Event) {
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

    private length(): AbstractControl {
        return this.form.get('length');
    }

    type(): AbstractControl {
        return this.form.get('type');
    }

    fieldName(): string {
        return 'amount';
    }
}

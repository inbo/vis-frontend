import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormGroupDirective, UntypedFormGroup} from '@angular/forms';
import {MeasurementComponentDirective} from '../measurement-component.directive';
import {WarningFormControl} from '../../../../shared-ui/warning-form-control/warning.form-control';
import {nullableNumberMask} from '../../length.mask';

@Component({
    selector: 'app-measurement-length',
    templateUrl: './measurement-length.component.html',
})
export class MeasurementLengthComponent extends MeasurementComponentDirective implements OnInit {

    readonly nullableNumberMask = nullableNumberMask;
    form: UntypedFormGroup;
    @Input() index: number;
    @Input() submitted = false;

    constructor(private rootFormGroup: FormGroupDirective) {
        super();
    }

    ngOnInit(): void {
        this.form = this.rootFormGroup.form;
    }

    length(): WarningFormControl {
        return this.form.get('length') as WarningFormControl;
    }

    amount(): AbstractControl {
        return this.form.get('amount');
    }

    fieldName(): string {
        return 'length';
    }
}

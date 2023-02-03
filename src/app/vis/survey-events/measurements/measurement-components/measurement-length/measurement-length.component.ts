import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl} from '@angular/forms';
import {MeasurementComponentDirective} from '../measurement-component.directive';
import {WarningFormControl} from '../../../../../shared-ui/warning-form-control/warning.form-control';
import {nullableNumberMask} from '../../../length.mask';

@Component({
    selector: 'vis-measurement-length',
    templateUrl: './measurement-length.component.html',
})
export class MeasurementLengthComponent extends MeasurementComponentDirective implements OnInit {

    readonly nullableNumberMask = nullableNumberMask;
    @Input() submitted = false;

    fieldName = 'length';

    length(): WarningFormControl {
        return this.form.get('length') as WarningFormControl;
    }

    amount(): AbstractControl {
        return this.form.get('amount');
    }

}

import {Component, Input, OnInit} from '@angular/core';
import {FormGroupDirective, UntypedFormGroup} from '@angular/forms';
import {MeasurementComponentDirective} from '../measurement-component.directive';
import {WarningFormControl} from '../../../../shared-ui/warning-form-control/warning.form-control';
import {nullableNumberMask} from '../../length.mask';

@Component({
    selector: 'app-measurement-weight',
    templateUrl: './measurement-weight.component.html',
})
export class MeasurementWeightComponent extends MeasurementComponentDirective implements OnInit {

    readonly nullableNumbermask = nullableNumberMask;

    form: UntypedFormGroup;
    @Input() index: number;

    constructor(private rootFormGroup: FormGroupDirective) {
        super();
    }

    ngOnInit(): void {
        this.form = this.rootFormGroup.form;
    }

    weight(): WarningFormControl {
        return this.form.get('weight') as WarningFormControl;
    }

    fieldName(): string {
        return 'weight';
    }
}

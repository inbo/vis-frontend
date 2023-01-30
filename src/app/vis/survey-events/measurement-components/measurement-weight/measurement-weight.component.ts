import {Component, Input} from '@angular/core';
import {MeasurementComponentDirective} from '../measurement-component.directive';
import {WarningFormControl} from '../../../../shared-ui/warning-form-control/warning.form-control';
import {nullableNumberMask} from '../../length.mask';

@Component({
    selector: 'app-measurement-weight',
    templateUrl: './measurement-weight.component.html',
})
export class MeasurementWeightComponent extends MeasurementComponentDirective {

    readonly nullableNumbermask = nullableNumberMask;

    fieldName = 'weight';

    @Input() submitted: boolean;


    weight(): WarningFormControl {
        return this.form.get('weight') as WarningFormControl;
    }

}

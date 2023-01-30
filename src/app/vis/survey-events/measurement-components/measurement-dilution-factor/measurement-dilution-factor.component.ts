import {Component, Input} from '@angular/core';
import {AbstractControl} from '@angular/forms';
import {MeasurementComponentDirective} from '../measurement-component.directive';

@Component({
    selector: 'app-measurement-dilution-factor',
    templateUrl: './measurement-dilution-factor.component.html',
})
export class MeasurementDilutionFactorComponent extends MeasurementComponentDirective {

    @Input() submitted: boolean;

    fieldName = 'dilutionFactor';

    dilutionFactor(): AbstractControl {
        return this.form.get(this.fieldName);
    }
}

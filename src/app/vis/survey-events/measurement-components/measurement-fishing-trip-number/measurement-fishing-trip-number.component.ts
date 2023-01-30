import {Component, Input} from '@angular/core';
import {MeasurementComponentDirective} from '../measurement-component.directive';

@Component({
    selector: 'app-measurement-fishing-trip-number',
    templateUrl: './measurement-fishing-trip-number.component.html',
})
export class MeasurementFishingTripNumberComponent extends MeasurementComponentDirective {

    @Input() submitted: boolean;

    fieldName = 'afvisBeurtNumber';

    afvisbeurtNumber() {
        return this.form.get(this.fieldName);
    }

}

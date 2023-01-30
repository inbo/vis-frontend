import {Component} from '@angular/core';
import {MeasurementComponentDirective} from '../measurement-component.directive';

@Component({
    selector: 'app-measurement-ship-side',
    templateUrl: './measurement-ship-side.component.html',
})
export class MeasurementShipSideComponent extends MeasurementComponentDirective {

    fieldName = 'isPortside';

    get selectedValue(): boolean {
        return this.form.get(this.fieldName).value;
    }

}

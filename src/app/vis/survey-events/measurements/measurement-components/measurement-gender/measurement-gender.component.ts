import {Component} from '@angular/core';
import {MeasurementComponentDirective} from '../measurement-component.directive';

@Component({
    selector: 'vis-measurement-gender',
    templateUrl: './measurement-gender.component.html',
})
export class MeasurementGenderComponent extends MeasurementComponentDirective {

    fieldName = 'gender';
}

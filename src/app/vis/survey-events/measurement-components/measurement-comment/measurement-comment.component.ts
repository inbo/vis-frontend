import {Component, Input} from '@angular/core';
import {MeasurementComponentDirective} from '../measurement-component.directive';

@Component({
    selector: 'app-measurement-comment',
    templateUrl: './measurement-comment.component.html',
})
export class MeasurementCommentComponent extends MeasurementComponentDirective {

    @Input() submitted: boolean;

    fieldName = 'comment';

    comment() {
        return this.form.get(this.fieldName);
    }
}

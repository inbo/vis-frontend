import {Component, Input, OnInit} from '@angular/core';
import {FormGroupDirective, UntypedFormGroup} from '@angular/forms';
import {MeasurementComponentDirective} from '../measurement-component.directive';

@Component({
    selector: 'app-measurement-comment',
    templateUrl: './measurement-comment.component.html',
})
export class MeasurementCommentComponent extends MeasurementComponentDirective implements OnInit {

    form: UntypedFormGroup;
    @Input() index: number;
    @Input() submitted: boolean;

    constructor(private rootFormGroup: FormGroupDirective) {
        super();
    }

    ngOnInit(): void {
        this.form = this.rootFormGroup.form;
    }

    fieldName(): string {
        return 'comment';
    }

    comment() {
        return this.form.get(this.fieldName());
    }
}

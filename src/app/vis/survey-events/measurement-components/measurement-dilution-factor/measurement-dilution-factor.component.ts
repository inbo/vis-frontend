import {Component, Input, OnInit} from '@angular/core';
import {AbstractControl, FormGroupDirective, UntypedFormGroup} from '@angular/forms';
import {MeasurementComponentDirective} from '../measurement-component.directive';

@Component({
    selector: 'app-measurement-dilution-factor',
    templateUrl: './measurement-dilution-factor.component.html',
})
export class MeasurementDilutionFactorComponent extends MeasurementComponentDirective implements OnInit {

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
        return 'dilutionFactor';
    }

    dilutionFactor(): AbstractControl {
        return this.form.get(this.fieldName());
    }
}

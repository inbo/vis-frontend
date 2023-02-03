import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AbstractControl, FormGroupDirective, UntypedFormArray, UntypedFormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {TaxaService} from '../../../services/vis.taxa.service';
import {faRulerHorizontal, faWeightHanging} from '@fortawesome/free-solid-svg-icons';
import {Role} from '../../../core/_models/role';
import {AuthService} from '../../../core/auth.service';
import {SearchableSelectOption} from '../../../shared-ui/searchable-select/SearchableSelectOption';
import {WarningFormControl} from '../../../shared-ui/warning-form-control/warning.form-control';

@Component({
    selector: 'vis-measurement-row-readonly',
    templateUrl: './measurement-row-readonly.component.html',
})
export class MeasurementRowReadonlyComponent implements OnInit, OnDestroy {

    readonly role = Role;
    readonly faWeightHanging = faWeightHanging;
    readonly faRulerHorizontal = faRulerHorizontal;

    @Input() formGroupName: number;
    @Input() submitted = false;
    @Input() showSaveMessage = false;
    @Input() editable = true;
    @Input() isAnkerkuil = false;

    @Output() editClicked = new EventEmitter<any>();
    @Output() removeClicked = new EventEmitter<any>();

    form: UntypedFormGroup;

    private formArray: UntypedFormArray;
    private subscription = new Subscription();

    showIndividualLengthItems = false;
    savedMessage = false;
    selectedSpecies: SearchableSelectOption<number>;

    constructor(private taxaService: TaxaService,
                private rootFormGroup: FormGroupDirective,
                public authService: AuthService) {

    }

    ngOnInit(): void {
        this.formArray = this.rootFormGroup.control.get('items') as UntypedFormArray;
        this.form = this.formArray.at(this.formGroupName) as UntypedFormGroup;
        this.taxaService
            .getAllSpeciesOptions()
            .subscribe(
                taxonOptions => this.selectedSpecies = taxonOptions.find(taxon => taxon.value === this.species().value),
            );

        if (this.showSaveMessage) {
            this.showSavedMessage();
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    species(): AbstractControl {
        return this.form.get('species');
    }

    afvisBeurtNumber(): AbstractControl {
        return this.form.get('afvisBeurtNumber');
    }

    dilutionFactor(): AbstractControl {
        return this.form.get('dilutionFactor');
    }

    isPortside(): AbstractControl {
        return this.form.get('isPortside');
    }

    weight(): WarningFormControl {
        return this.form.get('weight') as WarningFormControl;
    }

    length(): WarningFormControl {
        return this.form.get('length') as WarningFormControl;
    }

    amount(): AbstractControl {
        return this.form.get('amount');
    }

    gender(): AbstractControl {
        return this.form.get('gender');
    }

    comment(): AbstractControl {
        return this.form.get('comment');
    }

    type(): AbstractControl {
        return this.form.get('type');
    }

    order(): AbstractControl {
        return this.form.get('order');
    }

    individualLengths(): UntypedFormArray {
        return this.form.get('individualLengths') as UntypedFormArray;
    }

    edit() {
        this.editClicked.emit();
    }

    remove() {
        this.removeClicked.emit();
    }

    showSavedMessage() {
        this.showSaveMessage = false;
        this.savedMessage = true;
        setTimeout(() => {
            this.savedMessage = false;
        }, 2500);
    }

    toggleIndividualMeasurement() {
        this.showIndividualLengthItems = !this.showIndividualLengthItems;
    }
}

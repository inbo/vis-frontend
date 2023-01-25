import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {
    AbstractControl,
    FormGroupDirective,
    UntypedFormArray,
    UntypedFormBuilder,
    UntypedFormControl,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import {WarningFormControl} from '../../../../shared-ui/warning-form-control/warning.form-control';
import {valueBetweenWarning} from '../../survey-event-measurements-create-page/validators/value-between.warning-validator';
import {TaxonDetail} from '../../../../domain/taxa/taxon-detail';
import {distinctUntilChanged} from 'rxjs/operators';
import {nullableNumberMask} from '../../length.mask';
import {isEqual} from 'lodash-es';

@Component({
    selector: 'app-measurement-length-measurements',
    templateUrl: './measurement-length-measurements.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeasurementLengthMeasurementsComponent implements OnInit {

    readonly nullableNumbermask = nullableNumberMask;

    @ViewChildren('lengthInput', {read: ElementRef}) lengthInputs: QueryList<ElementRef<HTMLInputElement>>;
    @ViewChildren('commentInput', {read: ElementRef}) commentInputs: QueryList<ElementRef<HTMLInputElement>>;
    form: UntypedFormGroup;
    @Input() index: number;
    @Input() taxon: TaxonDetail;
    @Input() submitted = false;

    constructor(private rootFormGroup: FormGroupDirective,
                private formBuilder: UntypedFormBuilder,
                private changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.form = this.rootFormGroup.form;
        this.form.valueChanges
            .pipe(distinctUntilChanged(isEqual))
            .subscribe(() => this.changeDetectorRef.detectChanges());
    }

    getType(): AbstractControl {
        return this.form.get('type');
    }

    getAmount(): AbstractControl {
        return this.form.get('amount');
    }

    getAllIndividualLengths(): UntypedFormArray {
        return this.form.get('individualLengths') as UntypedFormArray;
    }

    getIndividualLength(i: number): WarningFormControl {
        return this.getAllIndividualLengths().at(i).get('length') as WarningFormControl;
    }

    getIndividualComment(i: number): AbstractControl {
        return this.getAllIndividualLengths().at(i).get('comment');
    }

    removeIndividualLength(i: number) {
        this.getAllIndividualLengths().removeAt(i);

        this.getAmount().setValidators(Validators.min(this.getAllIndividualLengths().length));
        this.changeDetectorRef.detectChanges();
    }

    newLengthOnTab(event: KeyboardEvent, i: number) {
        if (!event.shiftKey && this.isLastIndex(i)) {
            this.addIndividualLength();
            this.changeDetectorRef.detectChanges();
        }
    }

    onEnter(event: KeyboardEvent, inputType: 'comment' | 'length') {
        const inputs = inputType === 'comment' ? this.commentInputs : this.lengthInputs;
        const currentInput = inputs.find(input => input.nativeElement === event.target);
        if (inputs.last === currentInput) {
            this.addIndividualLength();
            setTimeout(() => {
                inputs.last.nativeElement.focus();
            }, 0);
        } else {
            const indexOfCurrentInput = inputs.toArray().indexOf(currentInput);
            inputs.get(indexOfCurrentInput + 1).nativeElement.focus();
        }
    }

    onLeftArrowKey(event: KeyboardEvent) {
        const lengthInputIndex = this.getLengthInputIndex(event);
        const commentInputIndex = this.getCommentInputIndex(event);

        if (lengthInputIndex === 0) {
            return;
        } else if (lengthInputIndex > -1) {
            this.commentInputs.get(lengthInputIndex - 1).nativeElement.focus();
            return;
        } else {
            this.lengthInputs.get(commentInputIndex).nativeElement.focus();
        }
    }

    onRightArrowKey(event: KeyboardEvent) {
        const lengthInputIndex = this.getLengthInputIndex(event);
        const commentInputIndex = this.getCommentInputIndex(event);

        if (commentInputIndex === this.commentInputs.length - 1) {
            return;
        } else if (lengthInputIndex > -1) {
            this.commentInputs.get(lengthInputIndex).nativeElement.focus();
            return;
        } else {
            this.lengthInputs.get(commentInputIndex + 1).nativeElement.focus();
        }
    }

    onUpArrowKey(event: KeyboardEvent) {
        const lengthInputIndex = this.getLengthInputIndex(event);
        const commentInputIndex = this.getCommentInputIndex(event);

        if (lengthInputIndex === 0 || commentInputIndex === 0) {
            return;
        } else if (lengthInputIndex > -1) {
            this.lengthInputs.get(lengthInputIndex - 1).nativeElement.focus();
            return;
        } else {
            this.commentInputs.get(commentInputIndex - 1).nativeElement.focus();
            return;
        }
    }

    onDownArrowKey(event: KeyboardEvent) {
        const lengthInputIndex = this.getLengthInputIndex(event);
        const commentInputIndex = this.getCommentInputIndex(event);

        if ([this.lengthInputs.last.nativeElement, this.commentInputs.last.nativeElement].includes(event.target as HTMLInputElement)) {
            return;
        } else if (lengthInputIndex > -1) {
            this.lengthInputs.get(lengthInputIndex + 1).nativeElement.focus();
            return;
        } else {
            this.commentInputs.get(commentInputIndex + 1).nativeElement.focus();
            return;
        }
    }

    private createIndividualLength(comment?: string): UntypedFormGroup {
        return this.formBuilder.group({
            length: new WarningFormControl(null, [Validators.min(0), Validators.required, this.taxon ? valueBetweenWarning(this.taxon.lengthMin, this.taxon.lengthMax, this.changeDetectorRef) : () => null]),
            comment: new UntypedFormControl(comment ?? '', Validators.max(2000)),
        });
    }

    private addIndividualLength() {
        const individualLengthsSize = this.getAllIndividualLengths().value.length;
        if (individualLengthsSize < this.getAmount().value) {
            this.getAllIndividualLengths().push(this.createIndividualLength());
            this.getAmount().setValidators(Validators.min(individualLengthsSize + 1));
            this.changeDetectorRef.detectChanges();
        }
    }

    private isLastIndex(i: number) {
        return this.getAllIndividualLengths() === undefined || (i + 1) === this.getAllIndividualLengths().length;
    }

    private getLengthInputIndex(event: KeyboardEvent) {
        return this.lengthInputs.map(elRef => elRef.nativeElement).indexOf(event.target as HTMLInputElement);
    }

    private getCommentInputIndex(event: KeyboardEvent) {
        return this.commentInputs.map(elRef => elRef.nativeElement).indexOf(event.target as HTMLInputElement);
    }
}

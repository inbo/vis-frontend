import {Component, ElementRef, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    FormGroupDirective,
    Validators,
} from '@angular/forms';
import {AbstractControlWarn} from '../../survey-event-measurements-create-page/survey-event-measurements-validators';

@Component({
    selector: 'app-measurement-length-measurements',
    templateUrl: './measurement-length-measurements.component.html',
})
export class MeasurementLengthMeasurementsComponent implements OnInit {

    @ViewChildren('lengthInput', {read: ElementRef}) lengthInputs: QueryList<ElementRef<HTMLInputElement>>;
    @ViewChildren('commentInput', {read: ElementRef}) commentInputs: QueryList<ElementRef<HTMLInputElement>>;
    form: FormGroup;
    @Input() index: number;
    @Input() submitted = false;

    constructor(private rootFormGroup: FormGroupDirective,
                private formBuilder: FormBuilder) {
    }

    ngOnInit(): void {
        this.form = this.rootFormGroup.form;
    }

    type(): AbstractControl {
        return this.form.get('type');
    }

    amount(): AbstractControl {
        return this.form.get('amount');
    }

    individualLengths(): FormArray {
        return this.form.get('individualLengths') as FormArray;
    }

    individualLength(i: number): AbstractControlWarn {
        return this.individualLengths().at(i).get('length') as AbstractControlWarn;
    }

    individualComment(i: number): AbstractControl {
        return this.individualLengths().at(i).get('comment');
    }

    removeIndividualLength(i: number) {
        this.individualLengths().removeAt(i);

        this.amount().setValidators(Validators.min(this.individualLengths().length));
    }

    newLengthOnTab(event: KeyboardEvent, i: number) {
        if (!event.shiftKey && this.isLastIndex(i)) {
            this.addIndividualLength();
        }
    }

    createIndividualLength(comment?: any): FormGroup {
        return this.formBuilder.group({
            length: new FormControl('', [Validators.min(0), Validators.required]),
            comment: new FormControl(comment ?? '', Validators.max(2000)),
        });
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

    private addIndividualLength() {
        const individualLengthsSize = this.individualLengths().value.length;
        if (individualLengthsSize < this.amount().value) {
            this.individualLengths().push(this.createIndividualLength());
            this.amount().setValidators(Validators.min(individualLengthsSize + 1));
        }
    }

    private isLastIndex(i: number) {
        return this.individualLengths() === undefined || (i + 1) === this.individualLengths().length;
    }

    private getLengthInputIndex(event: KeyboardEvent) {
        return this.lengthInputs.map(elRef => elRef.nativeElement).indexOf(event.target as HTMLInputElement);
    }

    private getCommentInputIndex(event: KeyboardEvent) {
        return this.commentInputs.map(elRef => elRef.nativeElement).indexOf(event.target as HTMLInputElement);
    }

}

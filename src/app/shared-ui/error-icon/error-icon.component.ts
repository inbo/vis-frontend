import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {NgxTippyProps} from 'ngx-tippy-wrapper';
import {AbstractControl, ValidationErrors} from '@angular/forms';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-error-icon',
    templateUrl: 'error-icon.component.html',
    styleUrls: ['error-icon.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorIconComponent implements OnInit, OnDestroy {

    readonly tippyProps: NgxTippyProps = {
        maxWidth: Infinity,
    };

    @Input() control: AbstractControl<any, any>;
    @Input() onlyShowAfterSubmitted = true;
    @Input() submitted = false;

    @Input()
    fieldName: string;
    private destroyed = new Subject();

    constructor(private changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.control
            .root
            .valueChanges
            .pipe(
                takeUntil(this.destroyed),
            )
            .subscribe(() => {
                this.changeDetectorRef.detectChanges();
            });
    }

    ngOnDestroy() {
        this.destroyed.next();
        this.destroyed.complete();
    }

    displayErrorMessage() {
        if (this.getErrorKeys().length > 0) {
            return (this.onlyShowAfterSubmitted && this.submitted) || (!this.onlyShowAfterSubmitted && (this.submitted ||
                (this.control.dirty || this.control.touched))) && this.control.invalid;
        }

        return false;
    }

    getErrorKeys(): Array<string> {
        if (!this.control?.errors) {
            return [];
        }
        return Object.keys(this.control.errors);
    }

    errorParams(error: string) {
        const params: ValidationErrors = this.control.errors[error];

        const result = {
            fieldName: this.fieldName,
        };

        for (const [key, value] of Object.entries(params)) {
            result[key] = value;
        }

        return result;
    }

}

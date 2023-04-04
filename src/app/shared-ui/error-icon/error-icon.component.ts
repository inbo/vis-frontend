import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnDestroy,
    SimpleChange,
    SimpleChanges,
} from '@angular/core';
import {NgxTippyProps, NgxTippyService} from 'ngx-tippy-wrapper';
import {AbstractControl} from '@angular/forms';
import {merge, Subscription} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {map, mapTo} from 'rxjs/operators';

@Component({
    selector: 'vis-error-icon',
    templateUrl: 'error-icon.component.html',
    styleUrls: ['error-icon.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorIconComponent implements OnDestroy, OnChanges {

    readonly tippyName = (Math.random() + 1).toString(36);
    readonly tippyProps: NgxTippyProps = {
        maxWidth: Infinity,
        allowHTML: true,
    };

    @Input() onlyShowAfterSubmitted = true;
    @Input() fieldName: string;
    @Input() ndbg: boolean = true;
    @Input() submitted: boolean;
    @Input() control: AbstractControl<any, any>;

    showErrorIcon: boolean = false;

    private formSubscription: Subscription;

    constructor(private changeDetectorRef: ChangeDetectorRef,
                private tippy: NgxTippyService,
                private translateService: TranslateService) {
    }

    ngOnChanges(changes: SimpleChanges) {
        const controlChange = changes.control as SimpleChange;
        const submittedChange = changes.submitted as SimpleChange;
        if (controlChange) {
            this.formSubscription?.unsubscribe();
            this.formSubscription = merge(
                this.control.root.statusChanges.pipe(map(() => 'root status changed')),
                this.control.root.valueChanges.pipe(map(() => 'root value changed')),
            ).subscribe(status => {
                this.updateErrors();
            });
        }
        if (submittedChange) {
            this.updateErrors();
        }
    }

    ngOnDestroy() {
        this.formSubscription?.unsubscribe();
    }

    displayErrorMessage() {
        return this.getErrorKeys().length > 0
            && (this.onlyShowAfterSubmitted && this.submitted)
            || (!this.onlyShowAfterSubmitted && (this.submitted || (this.control.dirty || this.control.touched)))
            && this.control.invalid;
    }

    getParamsForErrorKey(errorKey: string) {
        return {
            fieldName: this.fieldName,
            ...(this.control.errors[errorKey]),
        };
    }

    private updateErrors() {
        this.showErrorIcon = this.displayErrorMessage();
        this.changeDetectorRef.detectChanges();
        if (this.showErrorIcon) {
            this.tippy.getInstance(this.tippyName)?.setContent(this.createTooltipContentHTML());
            this.changeDetectorRef.detectChanges();
        }
    }

    private createTooltipContentHTML(): string {
        const errorKeys = this.getErrorKeys();
        let result = '<ul class="message-list">';
        errorKeys.forEach(errorKey => {
            result = result.concat(`<li class="message">${this.translateService.instant(`errorMessage.${errorKey}`, this.getParamsForErrorKey(errorKey))}</li>`);
        });
        result = result.concat(`</ul>`);
        return result;
    }

    private getErrorKeys() {
        return Object.keys(this.control?.errors || {});
    }
}

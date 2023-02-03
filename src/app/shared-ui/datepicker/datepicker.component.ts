import {AfterViewInit, Component, forwardRef, Input, ViewChild} from '@angular/core';
import flatpickr from 'flatpickr';
import {Dutch} from 'flatpickr/dist/l10n/nl.js';

import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
    selector: 'vis-datepicker',
    templateUrl: './datepicker.component.html',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DatepickerComponent),
            multi: true,
        },
    ],
})
export class DatepickerComponent implements ControlValueAccessor, AfterViewInit {

    private selectedDate: Date;
    private _minDate: Date;
    private _maxDate: Date;

    @Input() hideResetButton = false;
    @Input() initialDate;

    @Input() set minDate(val: Date) {
        this.setMinDate(val);
    };

    @Input() set maxDate(val: Date) {
        this.setMaxDate(val);
    }

    @ViewChild('datepicker') input;

    private onChange: Function;
    private onTouch: Function;
    private fp: any;

    writeValue(obj: Date): void {
        this.selectedDate = obj;
        if (this.fp !== undefined) {
            this.fp.setDate(obj);
        }
    }

    registerOnChange(fn: Function): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onTouch = fn;
    }

    dateValueChanged(): void {
        this.onChange(this.selectedDate);
    }

    ngAfterViewInit() {
        const _this = this;

        this.fp = flatpickr(this.input.nativeElement, {
            locale: Dutch,
            dateFormat: 'd-m-Y',
            minDate: this._minDate,
            maxDate: this._maxDate,
            defaultDate: this.selectedDate,
            onChange: (selectedDates) => {
                if (selectedDates.length === 1) {
                    _this.selectedDate = selectedDates[0];
                    _this.dateValueChanged();
                } else {
                    _this.selectedDate = null;
                    _this.dateValueChanged();
                }
            },
        });
    }

    private setMinDate(date: Date) {
        this._minDate = date;
        if (this.fp) {
            this.fp.set('minDate', date);
        }
    }

    private setMaxDate(date: Date) {
        this._maxDate = date;
        if (this.fp) {
            this.fp.set('maxDate', date);
        }
    }

    reset() {
        this.fp.clear();
    }
}

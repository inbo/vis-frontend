import {Component, forwardRef, ViewChild} from '@angular/core';
import flatpickr from "flatpickr";
import { Dutch } from "flatpickr/dist/l10n/nl.js"

import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'datepicker',
  templateUrl: './datepicker.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true
    }
  ]
})
export class DatepickerComponent implements ControlValueAccessor {
  private selectedDate: Date = new Date();

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

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    let _this = this;

    this.fp = flatpickr(this.input.nativeElement, {
      'locale': Dutch,
      onChange: function(selectedDates, dateStr, instance) {
        _this.selectedDate = selectedDates[0];
        _this.dateValueChanged();
      },
    });

  }

  reset() {
    this.fp.clear();
  }
}

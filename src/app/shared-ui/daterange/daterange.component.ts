import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import flatpickr from 'flatpickr';
import {Dutch} from 'flatpickr/dist/l10n/nl';
import {ControlValueAccessor} from '@angular/forms';

@Component({
  selector: 'app-daterange',
  templateUrl: './daterange.component.html'
})
export class DaterangeComponent implements ControlValueAccessor, OnInit, AfterViewInit {
  private selectedDates: Date[];

  @ViewChild('datepicker') input;

  private onChange: Function;
  private onTouch: Function;
  private fp: any;

  writeValue(obj: Date[]): void {
    this.selectedDates = obj;
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
    this.onChange(this.selectedDates);
  }

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    const _this = this;

    this.fp = flatpickr(this.input.nativeElement, {
      locale: Dutch,
      dateFormat: 'd-m-Y',
      mode: 'range',
      onChange: (selectedDates) => {
        if (selectedDates.length === 2) {
          _this.selectedDates = selectedDates;
          _this.dateValueChanged();
        } else {
          _this.selectedDates = [];
          _this.dateValueChanged();
        }
      },
    });

  }

  reset() {
    this.fp.clear();
  }
}

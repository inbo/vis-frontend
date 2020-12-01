import {Component, forwardRef, ViewChild} from '@angular/core';
import pikaday from 'pikaday'
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import moment from 'moment';

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

  private picker: pikaday;

  @ViewChild('datepicker') input;

  private onChange: Function;
  private onTouch: Function;

  writeValue(obj: Date): void {

    this.selectedDate = obj;
      if (this.picker !== undefined) {
        this.picker.setDate(obj, true);
      }
  }

  registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onTouch = fn;
  }

  dateValueChanged(): void {
    this.picker.setDate(this.selectedDate, true);
    this.onChange(this.selectedDate)
  }

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    let _this = this;
    this.picker = new pikaday({
      onSelect: function (date) {
        _this.selectedDate = new Date(date);
        _this.dateValueChanged();
      },
      format: 'DD/MM/YYYY',
      reposition: false,
      position: 'bottom left',
      field: this.input.nativeElement,
      // yearRange: [this.minYear, this.maxYear],
      theme: 'date-input',
      keyboardInput: true,
      firstDay: 1,
      defaultDate: this.selectedDate,
      setDefaultDate: true,
      i18n: {
        previousMonth: 'Vorige',
        nextMonth: 'Volgende',
        months: ['Jan', 'Feb', 'Maa', 'Apr', 'Mei', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
        weekdays: ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'],
        weekdaysShort: ['Zo', 'Ma', 'Di', 'Woe', 'Do', 'Vr', 'Za']
      }
    })
  }

  reset() {
    this.selectedDate = null;
    this.dateValueChanged();
  }
}

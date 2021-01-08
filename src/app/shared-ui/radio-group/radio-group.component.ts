import {Component, forwardRef, Input, OnInit, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import flatpickr from "flatpickr";
import {Dutch} from "flatpickr/dist/l10n/nl";

@Component({
  selector: 'radio-group',
  templateUrl: './radio-group.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupComponent),
      multi: true
    }
  ]
})
export class RadioGroupComponent implements ControlValueAccessor {

  @Input() options: string[];
  @Input() name: string;

  private selectedValue: string;

  private onChange: Function;
  private onTouch: Function;
  private fp: any;

  writeValue(obj: string): void {
    this.selectedValue = obj;
  }

  registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onTouch = fn;
  }

  constructor() {
  }

  ngOnInit(): void {
  }


  onClick($event: Event) {
    let value = ($event.target as HTMLInputElement).value;
    this.selectedValue = value;
    this.onChange(this.selectedValue);
  }
}

import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {CheckOption} from './checkOption';

@Component({
  selector: 'app-check-group',
  templateUrl: './check-group.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckGroupComponent),
      multi: true
    }
  ]
})
export class CheckGroupComponent implements ControlValueAccessor, OnInit {

  @Input() options: CheckOption[];
  @Input() name: string;

  private selectedValues: string[];

  private onChange: Function;
  private onTouch: Function;
  private fp: any;

  writeValue(obj: string[]): void {
    this.selectedValues = obj;
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
    const value = ($event.target as HTMLInputElement).value;
    const checked = ($event.target as HTMLInputElement).checked;

    this.selectedValues = this.selectedValues.filter(v => v !== value);

    if (checked) {
      this.selectedValues.push(value);
    }

    this.onChange(this.selectedValues);
  }

  isChecked(value: string) {
    return this.selectedValues === null ? false : this.selectedValues.indexOf(value) >= 0;
  }
}

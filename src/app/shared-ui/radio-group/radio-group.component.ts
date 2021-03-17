import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {RadioOption} from './radioOption';

@Component({
  selector: 'app-radio-group',
  templateUrl: './radio-group.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioGroupComponent),
      multi: true
    }
  ]
})
export class RadioGroupComponent implements ControlValueAccessor, OnInit {

  @Input() options: RadioOption<any>[];
  @Input() name: string;

  selectedValue: any;

  private onChange: Function;
  private onTouch: Function;

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
    console.log(this.selectedValue);
    this.options.forEach(value => {
      console.log(value);
    });
  }


  onClick($event: Event) {
    this.selectedValue = ($event.target as HTMLInputElement).value;
    this.onChange(this.selectedValue);
  }
}

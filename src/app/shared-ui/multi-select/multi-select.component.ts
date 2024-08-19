import {Component, ElementRef, forwardRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {MultiSelectOption} from './multi-select';
import {isBoolean} from 'lodash-es';

@Component({
  selector: 'vis-multi-select',
  templateUrl: './multi-select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectComponent),
      multi: true
    }
  ]
})
export class MultiSelectComponent implements OnInit, ControlValueAccessor {

  @ViewChild('selectBoxDiv') selectBoxDiv: ElementRef;
  @ViewChild('valuesList') valuesList: ElementRef;

  @Input() options: MultiSelectOption[] = [];
  @Input() formControlName: string;
  @Input() disabled = false;

  isOpen = false;
  selectedValues: any[] = [];

  private firstFocussed = false;
  private touched = false;
  private isDisabled = false;

  private onChange: (value) => void;
  private onTouched: () => void;

  constructor() {
  }

  ngOnInit(): void {
  }

  writeValue(obj: any): void {
    this.selectedValues = obj ?? [];
  }

  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      this.touched = true;
      this.onTouched();
    }
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  select(option: MultiSelectOption) {
    if (!this.isSelected(option.value)) {
      this.selectedValues.push(option.value);
    } else {
      this.selectedValues = this.selectedValues.filter(value => !this.isEqual(value, option.value));
    }
    this.onChange(this.selectedValues);

    this.markAsTouched();
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!this.selectBoxDiv.nativeElement.contains(event.target) &&
        !this.valuesList.nativeElement.contains(event.target)) {
      this.isOpen = false;
      this.markAsTouched();
    }
  }

  isSelected(option: MultiSelectOption) {
    if (!this.selectedValues) {
      return false;
    }

    return this.selectedValues.some(selectedValue => this.isEqual(selectedValue, option.value));
  }

  remove(option: MultiSelectOption) {
    this.selectedValues = this.selectedValues.filter(selectedValue => !this.isEqual(selectedValue, option.value));
    this.onChange(this.selectedValues);

    this.markAsTouched();
  }

  toggleList() {
    this.isOpen = !this.isOpen;
  }

  selectedValuesAsDisplayValues() {
    return this.options?.filter(option => this.selectedValues.some(value => this.isEqual(value, option.value)));
  }

  private isEqual(value1: any, value2: any): boolean {
    return JSON.stringify(value1) === JSON.stringify(value2);
  }
}

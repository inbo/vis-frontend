import {Component, ElementRef, forwardRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {MultiSelectOption} from './multi-select';

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
    if (!this.isSelected(option)) {
      this.selectedValues.push(option.value);
    } else {
      this.selectedValues = this.selectedValues.filter(value => value !== option.value);
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

  isSelected(id: MultiSelectOption) {
    if (!this.selectedValues) {
      return;
    }

    return this.selectedValues.some(value => value === id.value);
  }

  remove(id: MultiSelectOption) {
    this.selectedValues = this.selectedValues.filter(value => value !== id.value);
    this.onChange(this.selectedValues);

    this.markAsTouched();
  }

  toggleList() {
    this.isOpen = !this.isOpen;
  }

  selectedValuesAsDisplayValues() {
    return this.options?.filter(value => this.selectedValues.indexOf(value.value) >= 0);
  }
}

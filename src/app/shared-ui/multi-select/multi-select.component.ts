import {Component, ElementRef, forwardRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {Observable} from "rxjs";

@Component({
  selector: 'app-multi-select',
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

  @Input() options$: Observable<string[]>;
  @Input() translateKey: string;
  @Input() formControlName: string;

  isOpen = false;
  selectedValues: string[] = [];

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
    this.selectedValues = obj;
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

  select(option: string) {
    if (!this.isSelected(option)) {
      this.selectedValues.push(option)
    } else {
      this.selectedValues = this.selectedValues.filter(value => value !== option);
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

  isSelected(id: any) {
    return this.selectedValues?.some(value => value === id);
  }

  remove(id: any) {
    this.selectedValues = this.selectedValues.filter(value => value !== id);
    this.onChange(this.selectedValues);

    this.markAsTouched();
  }

  toggleList() {
    this.isOpen = !this.isOpen;
  }
}

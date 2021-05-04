import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {fromEvent, Subject, Subscription} from 'rxjs';
import {Option} from '../searchable-select/option';
import {debounceTime, filter, map} from 'rxjs/operators';

@Component({
  selector: 'app-multi-text-search',
  templateUrl: './multi-text-search.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiTextSearchComponent),
      multi: true
    }
  ]
})
export class MultiTextSearchComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked, ControlValueAccessor {

  @ViewChild('searchBox') searchBox: ElementRef;
  @ViewChild('searchBoxDiv') searchBoxDiv: ElementRef;
  @ViewChild('valuesList') valuesList: ElementRef;

  @Input() options$: Subject<Option[]>;
  @Input() formControlName: string;
  @Output() onSearch: EventEmitter<any> = new EventEmitter();

  isOpen = false;
  selectedValues: Option[] = [];

  private touched = false;
  private isDisabled = false;

  private onChange: (value) => void;
  private onTouched: () => void;

  private subscription = new Subscription();
  private firstFocussed = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.subscription.add(fromEvent(this.searchBox.nativeElement, 'keyup')
      .pipe(
        debounceTime(300),
        filter((event: KeyboardEvent) => event.key !== 'Tab'),
        map((event: KeyboardEvent) => (event.target as HTMLInputElement).value),
        filter(value => value.length >= 3)
      )
      .subscribe(value => {
        this.onSearch.emit(value);

        this.markAsTouched();
        this.isOpen = true;
      }));
  }

  ngAfterViewChecked() {
    const option = document.getElementById(`option-${this.formControlName}-0`);
    if (!this.firstFocussed && option) {
      option.focus();
      this.firstFocussed = true;
    }
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

  select(option: Option) {
    if (!this.isSelected(option.id)) {
      this.selectedValues.push(option);
      this.onChange(this.selectedValues);
    }

    this.markAsTouched();
    this.isOpen = false;
    this.searchBox.nativeElement.value = '';
    this.searchBox.nativeElement.focus();
  }

  focusSibbling(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      const sibling = (event.currentTarget as HTMLElement).nextElementSibling;
      (sibling as HTMLElement).focus();
    } else if (event.key === 'ArrowUp') {
      const sibling = (event.currentTarget as HTMLElement).previousElementSibling;
      (sibling as HTMLElement).focus();
    }
  }

  selectOnEnter(event: KeyboardEvent, option: Option) {
    if (event.key === 'Enter') {
      this.select(option);
    }
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!this.searchBoxDiv.nativeElement.contains(event.target) && !this.valuesList.nativeElement.contains(event.target)) {
      this.isOpen = false;
      this.markAsTouched();
    }
  }

  isSelected(id: any) {
    return this.selectedValues.some(value => value.id === id);
  }

  remove(id: any) {
    this.selectedValues = this.selectedValues.filter(value => value.id !== id);
    this.onChange(this.selectedValues);

    this.markAsTouched();
    this.isOpen = false;
    this.searchBox.nativeElement.focus();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

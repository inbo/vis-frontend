import {AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {fromEvent, Subject, Subscription} from 'rxjs';
import {debounceTime, filter, map} from 'rxjs/operators';
import {Option} from './option';

@Component({
  selector: 'app-searchable-select',
  templateUrl: './searchable-select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchableSelectComponent),
      multi: true
    }
  ]
})
export class SearchableSelectComponent implements OnInit, OnDestroy, AfterViewInit, ControlValueAccessor {

  @ViewChild('searchBox') searchBox: ElementRef;
  @ViewChild('valuesList') valuesList: ElementRef;
  @ViewChild('selectButton') selectButton: ElementRef;

  @Input() options$: Subject<Option[]>;
  @Output() onSearch: EventEmitter<any> = new EventEmitter();

  isOpen = false;
  selectedValue: Option;

  private touched = false;
  private isDisabled = false;

  private onChange: (value) => void;
  private onTouched: () => void;

  private subscription = new Subscription();

  constructor(private eRef: ElementRef) {
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
        this.markAsTouched();
        this.isOpen = true;

        this.onSearch.emit(value);
      }));
  }

  writeValue(obj: any): void {
    this.selectedValue = obj;
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
    this.selectedValue = option;
    this.onChange(this.selectedValue);

    this.markAsTouched();
    this.isOpen = false;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggle() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      setTimeout(() => {
        this.searchBox.nativeElement.focus();
      }, 0);

    }
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!this.selectButton.nativeElement.contains(event.target) && !this.valuesList.nativeElement.contains(event.target)) {
      this.isOpen = false;
      this.markAsTouched();
    }
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
}

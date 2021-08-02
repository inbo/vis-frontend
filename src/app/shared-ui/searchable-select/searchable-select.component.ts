import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input, OnChanges,
  OnDestroy,
  OnInit,
  Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {fromEvent, Subject, Subscription} from 'rxjs';
import {debounceTime, filter, map} from 'rxjs/operators';
import {SearchableSelectOption} from './option';

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
export class SearchableSelectComponent implements OnInit, OnDestroy, AfterViewInit, ControlValueAccessor, OnChanges {

  @ViewChild('searchBox') searchBox: ElementRef;
  @ViewChild('valuesList') valuesList: ElementRef;
  @ViewChild('selectButton') selectButton: ElementRef;

  @Input() passedId: string;
  @Input() formControlName: string;
  @Input() options: SearchableSelectOption[];
  @Input() options$: any;
  @Input() placeholder: string;
  @Output() onSearch: EventEmitter<any> = new EventEmitter();
  @Output() missingSelectedValue: EventEmitter<any> = new EventEmitter();

  isOpen = false;
  selectedValue: any;
  selectedValueOption: SearchableSelectOption;
  isDisabled = false;

  private touched = false;

  private onChange: (value) => void;
  private onTouched: () => void;

  private subscription = new Subscription();

  constructor(private eRef: ElementRef) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.selectedValueOption === undefined) {
      this.getSelectedValue();
    }
  }

  ngAfterViewInit() {
    this.subscription.add(fromEvent(this.searchBox.nativeElement, 'keyup')
      .pipe(
        debounceTime(300),
        filter((event: KeyboardEvent) => event.key !== 'Tab' && event.key !== 'Enter'),
        map((event: KeyboardEvent) => (event.target as HTMLInputElement).value),
        filter(value => value.length >= 3)
      )
      .subscribe(value => {
        this.markAsTouched();
        this.isOpen = true;

        this.onSearch.emit(value);
      }));

    this.subscription.add(fromEvent(this.searchBox.nativeElement, 'keydown')
      .pipe(
        filter((event: KeyboardEvent) => event.key === 'Enter')
      ).subscribe(() => {
        const option = document.getElementById(`option-0-${this.passedId}`);
        const option1 = document.getElementById(`option-1-${this.passedId}`);

        if (option && !option1) {
          option.click();
        }
      })
    );
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

  select(option: SearchableSelectOption) {
    this.selectedValue = option.value;
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
    if (!this.selectButton.nativeElement.contains(event.target) && !this.valuesList.nativeElement.contains(event.target) && this.isOpen) {
      this.isOpen = false;
      this.markAsTouched();
    }
  }

  @HostListener('document:keydown', ['$event'])
  tab(event: KeyboardEvent) {
    if (event.key === 'Tab') {
      if ((this.selectButton.nativeElement.contains(event.target) || this.searchBox.nativeElement.contains(event.target)
        || this.valuesList.nativeElement.contains(event.target)) && this.isOpen) {
        this.isOpen = false;
        this.markAsTouched();
      }
    }
  }

  @HostListener('focusout', ['$event'])
  ensureInput(event: FocusEvent): void {
    if (!this.selectButton.nativeElement.contains(event.relatedTarget) &&
      !this.valuesList.nativeElement.contains(event.relatedTarget)
      && !this.searchBox.nativeElement.contains(event.relatedTarget) && this.isOpen) {
      this.isOpen = false;
    }
  }

  focusSibbling(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      const sibling = (event.currentTarget as HTMLElement).nextElementSibling;
      if (sibling) {
        (sibling as HTMLElement).focus();
      }
    } else if (event.key === 'ArrowUp') {
      const sibling = (event.currentTarget as HTMLElement).previousElementSibling;
      if (sibling) {
        (sibling as HTMLElement).focus();
      }
    }
  }

  selectOnEnter(event: KeyboardEvent, option: SearchableSelectOption) {
    if (event.key === 'Enter') {
      this.select(option);
    }
  }

  getSelectedValue() {
    const filtered = this.options?.filter(value => value.value === this.selectedValue);
    if (filtered === undefined || filtered.length === 0) {
      this.missingSelectedValue.emit(this.selectedValue);
      return {
        value: '',
        displayValue: ''
      };
    } else {
      return filtered[0];
    }

  }
}

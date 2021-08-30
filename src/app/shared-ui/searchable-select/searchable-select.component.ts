import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {fromEvent, Subscription} from 'rxjs';
import {debounceTime, filter, map} from 'rxjs/operators';
import {SearchableSelectOption} from './option';
import {watch} from 'rxjs-watcher';

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

  @ContentChild('listItem', {static: false}) listItemTemplateRef: TemplateRef<any>;
  @ContentChild('selected', {static: false}) selectedTemplateRef: TemplateRef<any>;

  @ViewChild('searchBox') searchBox: ElementRef;
  @ViewChild('valuesList') valuesList: ElementRef;
  @ViewChild('selectButton') selectButton: ElementRef;

  @Input() passedId: string;
  @Input() formControlName: string;
  @Input() options: SearchableSelectOption[];
  @Input() placeholder: string;
  @Output() onSearch: EventEmitter<any> = new EventEmitter();

  isOpen = false;
  selectedValue: any;
  selectedValueOption: SearchableSelectOption;
  isDisabled = false;

  private touched = false;

  private onChange: (value) => void;
  private onTouched: () => void;

  private subscription: Subscription;

  constructor(private eRef: ElementRef, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.selectedValueOption === undefined) {
      const filtered = this.options?.filter(value => value.selectValue === this.selectedValue);
      if (!(filtered === undefined || filtered.length === 0)) {
        this.selectedValue = filtered[0].selectValue;
        this.selectedValueOption = filtered[0];
      }
    }
  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
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
    this.selectedValue = option.selectValue;
    this.selectedValueOption = option;
    this.onChange(this.selectedValue);

    this.markAsTouched();
    this.close();
  }

  toggle() {
    this.isOpen = !this.isOpen;

    this.subscription = new Subscription();

    let keyUp;
    let keyDown;
    if (this.isOpen) {
      keyUp = fromEvent(this.searchBox.nativeElement, 'keyup')
        .pipe(
          debounceTime(300),
          filter((event: KeyboardEvent) => event.key !== 'Tab' && event.key !== 'Enter'),
          map((event: KeyboardEvent) => (event.target as HTMLInputElement).value),
          filter(value => value.length >= 3),
          watch('keyup', 1000)
        )
        .subscribe(value => {
          this.isOpen = true;
          this.markAsTouched();
          this.cdr.detectChanges();

          this.onSearch.emit(value);
        });

      keyDown = fromEvent(this.searchBox.nativeElement, 'keydown')
        .pipe(
          filter((event: KeyboardEvent) => event.key === 'Enter'),
          watch('keydown', 1000)
        ).subscribe(() => {
          const option = document.getElementById(`option-0-${this.passedId}`);
          const option1 = document.getElementById(`option-1-${this.passedId}`);

          if (option && !option1) {
            option.click();
          }
        });

      this.subscription.add(keyUp);
      this.subscription.add(keyDown);

      this.addCloseListeners();

      setTimeout(() => {
        this.searchBox.nativeElement.focus();
      }, 0);

    } else {
      this.subscription.unsubscribe();
      this.markAsTouched();
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

  private addCloseListeners() {
    const documentClick = fromEvent(document, 'click')
      .pipe(watch('click', 1000))
      .subscribe((event) => {
          if (!this.selectButton.nativeElement.contains(event.target) && !this.valuesList.nativeElement.contains(event.target)
            && this.isOpen) {
            this.close();
            this.markAsTouched();
            this.cdr.detectChanges();
          }
        }
      );

    const keyDown = fromEvent(document, 'keydown')
      .pipe(watch('keydown', 1000))
      .subscribe((event: KeyboardEvent) => {
          if (event.key === 'Tab') {
            if ((this.selectButton.nativeElement.contains(event.target) || this.searchBox.nativeElement.contains(event.target)
              || this.valuesList.nativeElement.contains(event.target)) && this.isOpen) {
              this.close();
              this.markAsTouched();
              this.cdr.detectChanges();
            }
          }
        }
      );

    const focusOut = fromEvent(this.eRef.nativeElement, 'focusout')
      .pipe(watch('focusout', 1000))
      .subscribe((event: FocusEvent) => {
          if (!this.selectButton.nativeElement.contains(event.relatedTarget) &&
            !this.valuesList.nativeElement.contains(event.relatedTarget)
            && !this.searchBox.nativeElement.contains(event.relatedTarget) && this.isOpen) {
            this.close();
            this.markAsTouched();
            this.cdr.detectChanges();
          }
        }
      );

    this.subscription.add(documentClick);
    this.subscription.add(keyDown);
    this.subscription.add(focusOut);
  }

  private close() {
    this.isOpen = false;
    this.subscription.unsubscribe();
  }
}

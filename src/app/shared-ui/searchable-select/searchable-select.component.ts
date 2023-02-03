import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    QueryList,
    SimpleChanges,
    ViewChild,
    ViewChildren,
} from '@angular/core';
import {ControlValueAccessor, NgControl} from '@angular/forms';
import {asyncScheduler, fromEvent, merge, Subject} from 'rxjs';
import {debounceTime, filter, map, mapTo, takeUntil, takeWhile, throttleTime} from 'rxjs/operators';
import {SearchableSelectOption} from './SearchableSelectOption';
import {SearchableSelectConfig, SearchableSelectConfigBuilder} from './SearchableSelectConfig';
import {inRange, isEqual} from 'lodash-es';

@Component({
    selector: 'vis-searchable-select',
    templateUrl: './searchable-select.component.html',
    styleUrls: ['/searchable-select.component.scss'],
})
export class SearchableSelectComponent<T> implements OnDestroy, ControlValueAccessor, OnChanges, AfterViewInit {
    get open(): boolean {
        return this._open;
    }

    set open(value: boolean) {
        this._open = value;
        this.cdr.detectChanges();
    }
    @ViewChild('searchBox') searchBox: ElementRef<HTMLInputElement>;
    @ViewChild('valuesList') valuesList: ElementRef;
    @ViewChild('selectButton') selectButton: ElementRef;
    @ViewChildren('searchResultItem', {read: ElementRef}) searchResultItems: QueryList<ElementRef<HTMLElement>>;
    @Input() passedId: string;
    @Input() formControlName: string;
    @Input() placeholder: string;
    @Input() configuration?: SearchableSelectConfig = new SearchableSelectConfigBuilder().build();
    @Input() formControlValueProperty: string;
    @Output() search: EventEmitter<string> = new EventEmitter();
    @Output() enterPressed: EventEmitter<any> = new EventEmitter();
    @Output() reset = new EventEmitter<void>();
    isDisabled = false;
    selectedValue: any;
    selectedValueOption: SearchableSelectOption<T>;
    private destroy = new Subject<void>();
    private touched = false;
    private onChange: (value) => void;
    private onTouched: () => void;

    constructor(private elementRef: ElementRef,
                private cdr: ChangeDetectorRef,
                public ngControl: NgControl) {
        ngControl.valueAccessor = this;
    }

    private _open = false;

    private _options: SearchableSelectOption<T>[];

    get options(): SearchableSelectOption<T>[] {
        return this._options;
    }

    @Input()
    set options(value: SearchableSelectOption<T>[]) {
        this._options = value;
        if (!this.selectedValueOption && this.selectedValue) {
            this.selectedValueOption = this._options.find(option => option.value === this.selectedValue);
        }
        if (!this.selectedValueOption && this.ngControl.value) {
            const selectedValue: T = this.ngControl.value;
            this.selectedValueOption = this._options.find(option => option.value === selectedValue[this.formControlValueProperty]);
        }
    }

    ngAfterViewInit(): void {
        merge(
            fromEvent(this.selectButton.nativeElement, 'click').pipe(mapTo('click')),
            fromEvent(this.selectButton.nativeElement, 'focus').pipe(mapTo('focus')),
        ).pipe(
            takeUntil(this.destroy),
            throttleTime(1000, asyncScheduler, {leading: true, trailing: false}),
        ).subscribe(
            () => {
                this.toggle();
                setTimeout(() => {
                    this.valuesList?.nativeElement?.scrollIntoView({behavior: 'smooth', block: 'start'});
                    this.searchBox?.nativeElement?.focus();
                });
            },
        );

        fromEvent(document, 'click')
            .pipe(
                takeUntil(this.destroy),
                filter(() => this.open),
            )
            .subscribe((event: MouseEvent) => {
                    const clickX = event.x;
                    const clickY = event.y;
                    const listRect = this.valuesList.nativeElement.getBoundingClientRect();
                    const buttonRect = this.selectButton.nativeElement.getBoundingClientRect();

                    if (!this.areXAndYWithinBoundingRect(clickX, clickY, listRect) && !this.areXAndYWithinBoundingRect(clickX, clickY, buttonRect)) {
                        this.close();
                        this.markAsTouched();
                        this.cdr.detectChanges();
                    }
                },
            );

        fromEvent(document, 'keydown')
            .pipe(
                takeUntil(this.destroy),
                filter(() => this.open),
                filter((event: KeyboardEvent) => ['Tab', 'Escape'].includes(event.key)),
            )
            .subscribe((event: KeyboardEvent) => {
                    if ((this.selectButton.nativeElement.contains(event.target)
                        || this.searchBox.nativeElement.contains(event.target as Node)
                        || this.valuesList.nativeElement.contains(event.target))) {
                        this.close();
                        this.markAsTouched();
                        this.cdr.detectChanges();
                    }
                },
            );
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.selectedValueOption === undefined) {
            const filtered = this._options?.filter(value => isEqual(value.displayValue, this.selectedValue));
            if (filtered?.length > 0) {
                this.selectedValue = filtered[0].displayValue;
                this.selectedValueOption = filtered[0];
            }
        }
    }

    ngOnDestroy() {
        this.destroy.next();
        this.destroy.complete();
    }

    writeValue(obj: any): void {
        this.selectedValue = obj;
        if (obj === null && this.searchBox) {
            this.searchBox.nativeElement.value = '';
            this.reset.emit();
            this.selectedValueOption = undefined;
        }
        if (this.selectedValueOption === undefined) {
            this.selectedValueOption = this._options?.find(option => option.value === obj);
        }
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
            this.onTouched && this.onTouched();
        }
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
    }

    select(option: SearchableSelectOption<T>) {
        this.selectedValue = option.value;
        this.selectedValueOption = option;
        this.onChange && this.onChange(this.selectedValue);

        this.markAsTouched();
        this.close();
    }

    toggle() {
        this.open = !this.open;

        if (this.open) {
            fromEvent(this.searchBox.nativeElement, 'keyup')
                .pipe(
                    takeUntil(this.destroy),
                    takeWhile(() => this.open),
                    debounceTime(300),
                    filter((event: KeyboardEvent) => event.key !== 'Tab' && event.key !== 'Enter'),
                    map((event: KeyboardEvent) => (event.target as HTMLInputElement).value),
                    filter(value => value.length >= this.configuration.minQueryLength),
                )
                .subscribe(value => {
                    this.open = true;
                    this.markAsTouched();
                    this.cdr.detectChanges();

                    this.search.emit(value);
                });

            fromEvent(this.searchBox.nativeElement, 'keydown')
                .pipe(
                    takeUntil(this.destroy),
                    takeWhile(() => this.open),
                    filter((event: KeyboardEvent) => event.key === 'Enter'),
                ).subscribe((event) => {
                this.enterPressed.emit({event, open: this.open});

                const option = document.getElementById(`option-0-${this.passedId}`);
                const option1 = document.getElementById(`option-1-${this.passedId}`);

                if (option && !option1) {
                    option.click();
                }
            });

        } else {
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

    selectOnEnter(event: KeyboardEvent, option: SearchableSelectOption<T>) {
        if (event.key === 'Enter') {
            this.select(option);
            this.enterPressed.emit({event, open: this.open});
        }
    }

    enter(event: KeyboardEvent) {
        this.enterPressed.emit({event, open: this.open});
    }

    focusFirstResultItem(keyEvent: KeyboardEvent): void {
        keyEvent.preventDefault();
        this.searchResultItems.first?.nativeElement.focus();
    }

    private areXAndYWithinBoundingRect(x: number, y: number, elementRect: DOMRect): boolean {
        return inRange(x, elementRect.x, elementRect.x + elementRect.width) && inRange(y, elementRect.y, elementRect.y + elementRect.height);
    }

    private close() {
        this.open = false;
    }
}

import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-slide-over-filter',
  templateUrl: './slide-over-filter.component.html'
})
export class SlideOverFilterComponent implements OnInit, OnChanges {
  filterIsVisible = false;

  @Input() formGroup: FormGroup;
  @Input() showFilterAtStartup: boolean;
  @Output() searchClicked = new EventEmitter<boolean>();
  @Output() resetClicked = new EventEmitter<boolean>();

  showResetTip: boolean = false;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.showAdvancedFilterAtStartup !== undefined &&
      changes.showAdvancedFilterAtStartup.currentValue !== changes.showAdvancedFilterAtStartup.previousValue) {
      this.filterIsVisible = changes.showAdvancedFilterAtStartup.currentValue;
    }
  }

  ngOnInit(): void {
  }

  reset() {
    this.formGroup.reset();
    this.resetClicked.emit(true);
  }

  filterOnKeydown(event: KeyboardEvent) {
    if (event.ctrlKey && event.code === 'Enter') {
      this.searchClicked.emit(true);
    }

    if (event.ctrlKey && event.code === 'KeyR') {
      event.preventDefault();
      this.reset();
    }

    if (event.ctrlKey && event.code === 'KeyE') {
      event.preventDefault();
      this.filterIsVisible = !this.filterIsVisible;
    }
  }

  filter() {
    this.filterIsVisible = false;
    this.searchClicked.emit(true);
  }

  cancel() {
    this.filterIsVisible = false;
  }
}

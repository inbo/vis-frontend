import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';

@Component({
  selector: 'vis-expandable-filter',
  templateUrl: './expandable-filter.component.html'
})
export class ExpandableFilterComponent implements OnInit, OnChanges {
  advancedFilterIsVisible = false;

  @Input() hideSearchButton: boolean = false;
  @Input() formGroup: UntypedFormGroup;
  @Input() showAdvancedFilterAtStartup: boolean;
  @Input() showAdvancedFilter = true;
  @Output() searchClicked = new EventEmitter<boolean>();
  @Output() resetClicked = new EventEmitter<boolean>();

  showResetTip: boolean = false;

  constructor() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.showAdvancedFilterAtStartup !== undefined &&
      changes.showAdvancedFilterAtStartup.currentValue !== changes.showAdvancedFilterAtStartup.previousValue) {
      this.advancedFilterIsVisible = changes.showAdvancedFilterAtStartup.currentValue;
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
      this.advancedFilterIsVisible = !this.advancedFilterIsVisible;

    }
  }

  filter() {
    this.searchClicked.emit(true);
  }
}

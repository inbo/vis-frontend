import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'expandable-filter',
  templateUrl: './expandable-filter.component.html'
})
export class ExpandableFilterComponent implements OnInit, OnChanges {
  advancedFilterIsVisible: boolean = false;

  @Input() formGroup: FormGroup;
  @Input() showAdvancedFilterAtStartup: boolean;
  @Output() searchClicked = new EventEmitter<boolean>();
  @Output() resetClicked = new EventEmitter<boolean>();

  constructor() {

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.showAdvancedFilterAtStartup !== undefined && changes.showAdvancedFilterAtStartup.currentValue !== changes.showAdvancedFilterAtStartup.previousValue) {
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
  }

  filter() {
      this.searchClicked.emit(true);
  }
}

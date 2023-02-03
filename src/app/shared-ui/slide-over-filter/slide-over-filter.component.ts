import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';
import {Tag} from './tag';

@Component({
  selector: 'vis-slide-over-filter',
  templateUrl: './slide-over-filter.component.html'
})
export class SlideOverFilterComponent implements OnInit {
  filterIsVisible = false;

  @Input() tags: Tag[];
  @Input() formGroup: UntypedFormGroup;
  @Input() closeFilterOnReset = false;
  @Output() searchClicked = new EventEmitter<boolean>();
  @Output() resetClicked = new EventEmitter<boolean>();

  showResetTip = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  reset() {
    this.formGroup.reset();
    this.resetClicked.emit(true);
    if (this.closeFilterOnReset) {
      this.filterIsVisible = false;
    }
  }

  filterOnKeydown(event: KeyboardEvent) {
    if (event.ctrlKey && event.code === 'Enter') {
      this.searchClicked.emit(true);
      this.filterIsVisible = false;
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
    this.searchClicked.emit(true);
    this.filterIsVisible = false;
  }

  cancel() {
    this.filterIsVisible = false;
  }
}

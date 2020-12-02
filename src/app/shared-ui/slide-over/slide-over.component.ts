import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'slide-over',
  templateUrl: './slide-over.component.html'
})
export class SlideOverComponent implements OnInit {

  @Input() isOpen: boolean = false;
  @Output() isOpenChange = new EventEmitter<boolean>();

  constructor() {
  }

  ngOnInit(): void {
  }

  close() {
    this.isOpenChange.emit(false);
  }

}

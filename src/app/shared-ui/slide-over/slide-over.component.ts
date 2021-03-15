import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-slide-over',
  templateUrl: './slide-over.component.html'
})
export class SlideOverComponent implements OnInit {

  @Input() isOpen = false;
  @Output() isOpenChange = new EventEmitter<boolean>();

  constructor() {
  }

  ngOnInit(): void {
  }

  close() {
    this.isOpenChange.emit(false);
  }

}

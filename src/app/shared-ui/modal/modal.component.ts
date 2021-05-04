import {Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html'
})
export class ModalComponent implements OnInit {

  @Input() isOpen = false;
  @Input() showButtons = true;
  @Output() onPrimary = new EventEmitter<boolean>();
  @Output() onCancel = new EventEmitter<boolean>();

  constructor() {
  }

  ngOnInit(): void {
  }

  cancel() {
    this.onCancel.emit(true);
  }

  primaryClicked() {
    this.onPrimary.emit(true);
  }

}

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html'
})
export class ModalComponent implements OnInit {

  @Input() isOpen = false;
  @Input() showButtons = true;
  @Input() showOptional = false;
  @Output() onPrimary = new EventEmitter<boolean>();
  @Output() onCancel = new EventEmitter<boolean>();
  @Output() onOptional = new EventEmitter<boolean>();

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

  optionalClicked() {
    this.onOptional.emit(true);
  }
}

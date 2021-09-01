import {Directive, EventEmitter, Output} from '@angular/core';

@Directive()
export class MeasurementComponentDirective {
  @Output() enterPressed = new EventEmitter<string>();
  @Output() tabPressed = new EventEmitter<string>();
  @Output() arrowPressed = new EventEmitter<string>();

  fieldName(): string {
    return '';
  }

  keydown($event: KeyboardEvent) {
    if ($event.key === 'Enter') {
      $event.preventDefault();
      this.enterPressed.emit(this.fieldName());
    }
    if ($event.key === 'Tab') {
      this.tabPressed.emit(this.fieldName());
    }

    const isArrowKey = this.isKeyArrowUp($event.key)
      || this.isKeyArrowDown($event.key)
      || this.isKeyArrowLeft($event.key)
      || this.isKeyArrowRight($event.key);

    if ($event.ctrlKey && isArrowKey) {
      $event.preventDefault();
      this.arrowPressed.emit($event.key);
    }
  }

  private isKeyArrowUp(key: string) {
    return key === 'ArrowUp';
  }

  private isKeyArrowDown(key: string) {
    return key === 'ArrowDown';
  }

  private isKeyArrowLeft(key: string) {
    return key === 'ArrowLeft';
  }

  private isKeyArrowRight(key: string) {
    return key === 'ArrowRight';
  }

}

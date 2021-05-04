import {Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-slide-over',
  templateUrl: './slide-over.component.html'
})
export class SlideOverComponent implements OnInit {

  @ViewChild('overlay') overlay: ElementRef;
  @ViewChild('section') section: ElementRef;

  @Input() isOpen = false;
  @Input() closeOnClickOutside = false;
  @Output() isOpenChange = new EventEmitter<boolean>();

  constructor() {
  }

  ngOnInit(): void {
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (this.overlay.nativeElement.contains(event.target) && !this.section.nativeElement.contains(event.target) && this.isOpen
      && this.closeOnClickOutside) {
      this.isOpenChange.emit(false);
    }
  }

  close() {
    this.isOpenChange.emit(false);
  }

}

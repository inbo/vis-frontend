import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'vis-dropdown-minimal',
  templateUrl: './dropdown-minimal.component.html'
})
export class DropdownMinimalComponent implements OnInit {
  @ViewChild('buttons') buttonsDiv: ElementRef;

  isOpen = false;

  constructor(private eRef: ElementRef) {
  }

  ngOnInit(): void {
  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    } else if (this.buttonsDiv && this.buttonsDiv.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  public close() {
    this.isOpen = false;
  }
}

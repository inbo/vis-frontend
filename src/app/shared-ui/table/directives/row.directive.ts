import {Directive, ElementRef, Input, OnInit} from '@angular/core';

@Directive({
  selector: '[appRow]'
})
export class RowDirective implements OnInit {
  @Input()
  rownumber: number;

  constructor(private el: ElementRef) {
  }

  ngOnInit(): void {
    if (!this.rownumber) {
      (this.el.nativeElement as HTMLElement).classList.add('bg-white');
      return;
    }
    if (this.rownumber % 2 === 0) {
      (this.el.nativeElement as HTMLElement).classList.add('bg-white');
    } else {
      (this.el.nativeElement as HTMLElement).classList.add('bg-gray-50');
    }
  }

}

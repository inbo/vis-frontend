import {Directive, ElementRef, Input, OnInit} from '@angular/core';

@Directive({
  selector: '[appCell]'
})
export class CellDirective implements OnInit {

  @Input()
  actions = false;

  @Input()
  condense = false;

  constructor(private el: ElementRef) {
  }

  ngOnInit(): void {
    (this.el.nativeElement as HTMLElement).classList.add('px-6', this.condense ? 'py-1' : 'py-4', 'text-sm', 'text-gray-500');

    if (this.actions) {
      (this.el.nativeElement as HTMLElement).classList.add('text-right', 'font-medium');
    }
  }

}

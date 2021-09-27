import {Directive, ElementRef, OnInit} from '@angular/core';

@Directive({
  selector: '[appHeader]'
})
export class HeaderDirective implements OnInit {

  constructor(private el: ElementRef) {
  }

  ngOnInit(): void {
    (this.el.nativeElement as HTMLElement).classList.add('px-6', 'py-3', 'bg-gray-50', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase', 'tracking-wider');
  }

}

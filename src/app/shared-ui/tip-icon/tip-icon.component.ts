import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-tip-icon',
  templateUrl: './tip-icon.component.html'
})
export class TipIconComponent implements OnInit {

  @Input() tipPage = 'COMMON';
  @Input() style: string;

  headerStyle = 'bg-pink-500 p-1 text-pink-200 rounded-full hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ' +
    'focus:ring-offset-pink-500 focus:ring-white';
  defaultStyle = 'p-1 text-pink-600 rounded-full hover:text-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 ' +
    'focus:ring-offset-pink-600 focus:ring-white';

  constructor() {
  }

  ngOnInit(): void {
  }

  usedStyle(): string {
    switch (this.style) {
      case 'header':
        return this.headerStyle;
      default:
        return this.defaultStyle;
    }
  }
}

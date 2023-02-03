import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'vis-pill',
  templateUrl: './pill.component.html'
})
export class PillComponent implements OnInit {

  @Input()
  color = 'gray';

  colorClasses = 'bg-gray-100 text-gray-800';

  constructor() {
  }

  ngOnInit(): void {
    switch (this.color) {
      case 'gray':
        this.colorClasses = 'bg-gray-100 text-gray-800';
        break;
      case 'red':
        this.colorClasses = 'bg-red-100 text-red-800';
        break;
      case 'yellow':
        this.colorClasses = 'bg-yellow-100 text-yellow-800';
        break;
      case 'green':
        this.colorClasses = 'bg-green-100 text-green-800';
        break;
      case 'blue':
        this.colorClasses = 'bg-blue-100 text-blue-800';
        break;
      case 'indigo':
        this.colorClasses = 'bg-indigo-100 text-indigo-800';
        break;
      case 'purple':
        this.colorClasses = 'bg-purple-100 text-purple-800';
        break;
      case 'pink':
        this.colorClasses = 'bg-pink-100 text-pink-800';
        break;
      default:
        this.colorClasses = 'bg-gray-100 text-gray-800';
        break;
    }
  }

}

import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'vis-text-counter',
  templateUrl: './text-counter.component.html'
})
export class TextCounterComponent implements OnInit {

  @Input() max: number;
  @Input() text: string;


  constructor() {
  }

  ngOnInit(): void {
  }

}

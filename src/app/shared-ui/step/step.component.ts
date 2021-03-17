import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-step',
  templateUrl: './step.component.html'
})
export class StepComponent implements OnInit {
  @Input()
  description: string;

  @Input()
  step: string;

  @Input()
  active: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}

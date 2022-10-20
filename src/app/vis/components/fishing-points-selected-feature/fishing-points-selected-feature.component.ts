import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-fishing-points-selected-feature',
  templateUrl: './fishing-points-selected-feature.component.html'
})
export class FishingPointsSelectedFeatureComponent implements OnInit {

  @Input()
  properties: any;

  @Input()
  layerNumber: number;

  @Input()
  layerName: string;

  constructor() { }

  ngOnInit(): void {
  }

  // Needed because the keyValue pipe automatically orders the properties by key alphabetically
  readonly originalOrderCompare = (a: any, b: any) => 0;
}

import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-fishing-points-map-properties',
  templateUrl: './fishing-points-map-properties.component.html'
})
export class FishingPointsMapPropertiesComponent implements OnInit {
  @Input()
  selected: any;

  constructor() { }

  ngOnInit(): void {
  }

}

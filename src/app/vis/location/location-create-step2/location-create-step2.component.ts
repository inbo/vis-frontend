import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {FishingPointsMapComponent} from '../../components/fishing-points-map/fishing-points-map.component';
import {latLng} from 'leaflet';
import {FeatureSelection} from "../../components/fishing-points-map/feature-selection";

@Component({
  selector: 'app-location-create-step2',
  templateUrl: './location-create-step2.component.html'
})
export class LocationCreateStep2Component implements OnInit {
  @ViewChild(FishingPointsMapComponent, {static: true}) map: FishingPointsMapComponent;

  @Input() formGroup;

  selected = {layer: null, properties: {}};

  constructor(private titleService: Title) {
    this.titleService.setTitle('Locatie toevoegen');
  }

  ngOnInit(): void {
    const latlng = latLng(this.formGroup.get('lat').value, this.formGroup.get('lng').value);
    this.map.replaceNewLocationMarker(latlng);
    this.map.setCenter(latlng);
  }

  featureSelected(selection: FeatureSelection) {
    if (selection.layer === 0) {
      this.formGroup.get('vhaInfo').patchValue(selection.properties);
    } else {
      this.formGroup.get('vhaInfo').patchValue(null);
    }
    this.selected = selection;
  }

  vhaZoneSelected(selection: FeatureSelection) {
    this.formGroup.get('vhaZone').patchValue(selection.properties);
  }
}

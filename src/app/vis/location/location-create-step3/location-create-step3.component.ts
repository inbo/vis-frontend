import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FishingPointsMapComponent} from '../../components/fishing-points-map/fishing-points-map.component';
import {Title} from '@angular/platform-browser';
import {latLng} from 'leaflet';

@Component({
  selector: 'app-location-create-step3',
  templateUrl: './location-create-step3.component.html'
})
export class LocationCreateStep3Component implements OnInit {
  @ViewChild(FishingPointsMapComponent, {static: true}) map: FishingPointsMapComponent;

  @Input() formGroup;

  constructor(private titleService: Title) {
    this.titleService.setTitle('Locatie toevoegen');
  }

  ngOnInit(): void {
    const latlng = latLng(this.formGroup.get('lat').value, this.formGroup.get('lng').value);
    this.map.replaceNewLocationMarker(latlng);
    this.map.setCenter(latlng);
  }

  featureSelected(properties: any) {
    if (properties !== null) {
      this.formGroup.get('blueLayerInfo').patchValue(properties);
    } else {
      this.formGroup.get('blueLayerInfo').patchValue(null);
    }
  }

  townSelected(properties: any) {
    this.formGroup.get('townInfo').patchValue(properties);
  }

  onLoaded() {
    const latlng = latLng(this.formGroup.get('lat').value, this.formGroup.get('lng').value);
    this.map.updateTownLayerSelection(latlng);
  }
}

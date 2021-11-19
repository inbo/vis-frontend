import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {FishingPointsMapComponent} from '../../components/fishing-points-map/fishing-points-map.component';
import {latLng} from 'leaflet';

@Component({
  selector: 'app-location-create-step2',
  templateUrl: './location-create-step2.component.html'
})
export class LocationCreateStep2Component implements OnInit {
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
      this.formGroup.get('vhaInfo').patchValue(properties);
    } else {
      this.formGroup.get('vhaInfo').patchValue(null);
    }
  }

  mapLoaded() {
    const latlng = latLng(this.formGroup.get('lat').value, this.formGroup.get('lng').value);
    this.map.updateTownLayerSelection(latlng);
  }

  townSelected(properties: any) {
    this.formGroup.get('townInfo').patchValue(properties);
  }

  numberMask(scale: number, min: number, max: number) {
    return {
      mask: Number,
      scale,
      signed: true,
      thousandsSeparator: '',
      radix: ',',
      min,
      max
    };
  }

  get slope() {
    return this.formGroup.get('slope');
  }

  get width() {
    return this.formGroup.get('width');
  }

  get townInfoValue() {
    return this.formGroup.get('townInfo').value;
  }

  get vhaInfoValue() {
    return this.formGroup.get('vhaInfo').value;
  }

  vhaInfoEmpty() {
    return this.formGroup.get('vhaInfo').invalid;
  }
}

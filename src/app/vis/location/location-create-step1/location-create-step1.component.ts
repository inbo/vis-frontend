import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {LatLng, latLng} from 'leaflet';
import {Title} from '@angular/platform-browser';
import {FormGroup} from '@angular/forms';
import {debounceTime} from 'rxjs/operators';
import {FishingPointsMapComponent} from '../../components/fishing-points-map/fishing-points-map.component';

@Component({
  selector: 'app-location-create-step1',
  templateUrl: './location-create-step1.component.html'
})
export class LocationCreateStep1Component implements OnInit {
  @ViewChild(FishingPointsMapComponent) map: FishingPointsMapComponent;

  @Input() formGroup: FormGroup;

  selected = {};

  constructor(private titleService: Title) {
    this.titleService.setTitle('Locatie toevoegen');
  }

  ngOnInit(): void {
    this.setup();
  }

  private setup() {
    this.formGroup.get('lat').valueChanges.pipe(debounceTime(300))
      .subscribe(value => {
        if (this.formGroup.get('lat').invalid || this.formGroup.get('lng').invalid) {
          this.map.clearNewLocationMarker();
          return;
        }

        const latlng = latLng(value, this.formGroup.get('lng').value);
        this.map.replaceNewLocationMarker(latlng);
      });

    this.formGroup.get('lng').valueChanges.pipe(debounceTime(300))
      .subscribe(value => {
        if (this.formGroup.get('lat').invalid || this.formGroup.get('lng').invalid) {
          this.map.clearNewLocationMarker();
          return;
        }

        const latlng = latLng(this.formGroup.get('lat').value, value);
        this.map.replaceNewLocationMarker(latlng);
      });
  }

  pointAdded(e: LatLng) {
    this.formGroup.get('lat').patchValue(e.lat, {emitEvent: false});
    this.formGroup.get('lng').patchValue(e.lng, {emitEvent: false});
  }

  coordinatesAreInvalid() {
    return (this.formGroup.get('lat').touched && this.formGroup.get('lat').invalid)
      || (this.formGroup.get('lng').touched && this.formGroup.get('lng').invalid);
  }

  featureSelected($event: any) {
    this.selected = $event;
  }
}

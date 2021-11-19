import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {LatLng, latLng} from 'leaflet';
import {Title} from '@angular/platform-browser';
import {FormGroup} from '@angular/forms';
import {debounceTime, take} from 'rxjs/operators';
import {FishingPointsMapComponent} from '../../components/fishing-points-map/fishing-points-map.component';
import {LocationsService} from '../../../services/vis.locations.service';

@Component({
  selector: 'app-location-create-step1',
  templateUrl: './location-create-step1.component.html'
})
export class LocationCreateStep1Component implements OnInit {
  @ViewChild(FishingPointsMapComponent) map: FishingPointsMapComponent;

  @Input() formGroup: FormGroup;

  convertingCoordinates = false;

  constructor(private titleService: Title, private locationsService: LocationsService) {
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

        this.convertCoordinates(value, this.formGroup.get('lng').value, 'latlng');
      });

    this.formGroup.get('lng').valueChanges.pipe(debounceTime(300))
      .subscribe(value => {
        if (this.formGroup.get('lat').invalid || this.formGroup.get('lng').invalid) {
          this.map.clearNewLocationMarker();
          return;
        }

        const latlng = latLng(this.formGroup.get('lat').value, value);
        this.map.replaceNewLocationMarker(latlng);

        this.convertCoordinates(this.formGroup.get('lat').value, value, 'latlng');
      });

    this.formGroup.get('x').valueChanges.pipe(debounceTime(300))
      .subscribe(value => {
        if (this.formGroup.get('x').invalid || this.formGroup.get('y').invalid) {
          return;
        }

        this.convertCoordinates(value, this.formGroup.get('y').value, 'lambert');
      });

    this.formGroup.get('y').valueChanges.pipe(debounceTime(300))
      .subscribe(value => {
        if (this.formGroup.get('x').invalid || this.formGroup.get('y').invalid) {
          return;
        }

        this.convertCoordinates(this.formGroup.get('x').value, value, 'lambert');
      });
  }

  private convertCoordinates(lat: number, lng: number, source: string) {
    if (!this.convertingCoordinates) {
      this.locationsService.convertCoordinates(lat, lng, source)
        .pipe(take(1))
        .subscribe(coordinates => {
          this.convertingCoordinates = true;
          this.formGroup.get(source === 'latlng' ? 'x' : 'lat').patchValue(coordinates.x);
          this.formGroup.get(source === 'latlng' ? 'y' : 'lng').patchValue(coordinates.y);

          setTimeout(() => {
            // Wait for debounce
            this.convertingCoordinates = false;
          }, 500);
        });
    }
  }

  pointAdded(e: LatLng) {
    this.formGroup.get('lat').patchValue(e.lat, {emitEvent: false});
    this.formGroup.get('lng').patchValue(e.lng, {emitEvent: false});
    this.convertCoordinates(e.lat, e.lng, 'latlng');
  }

  coordinatesAreInvalid() {
    return (this.formGroup.get('lat').touched && this.formGroup.get('lat').invalid)
      || (this.formGroup.get('lng').touched && this.formGroup.get('lng').invalid);
  }

  coordinatesAreEmpty() {
    return (this.formGroup.get('lat').invalid)
      || (this.formGroup.get('lng').invalid);
  }

  get code() {
    return this.formGroup.get('code');
  }

  get description() {
    return this.formGroup.get('description');
  }

  get type() {
    return this.formGroup.get('type');
  }
}

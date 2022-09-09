import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {LatLng, latLng} from 'leaflet';
import {Title} from '@angular/platform-browser';
import {FormGroup} from '@angular/forms';
import {debounceTime, take} from 'rxjs/operators';
import {FishingPointsMapComponent} from '../../components/fishing-points-map/fishing-points-map.component';
import {LocationsService} from '../../../services/vis.locations.service';
import {IndexType} from '../../../domain/location/index-type';
import {FishingPointType} from '../location-create-page/fishing-point-type.enum';

@Component({
    selector: 'app-location-create-step1',
    templateUrl: './location-create-step1.component.html',
})
export class LocationCreateStep1Component implements OnInit, AfterViewInit {

    readonly FishingPointType = FishingPointType;

    @ViewChild(FishingPointsMapComponent) map: FishingPointsMapComponent;

    @Input() formGroup: FormGroup;
    @Input() editMode: boolean;
    @Input() canEditIndexType: boolean;
    @Input() indexTypes: Array<IndexType>;
    @Input() fishingPointType: FishingPointType;

    @Output() fishingPointTypeChange = new EventEmitter<FishingPointType>();

    convertingCoordinates = false;

    constructor(private titleService: Title,
                private locationsService: LocationsService) {
        this.titleService.setTitle('Locatie toevoegen');
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

    ngOnInit(): void {
        this.setup();
    }

    ngAfterViewInit() {
        if (this.editMode) {
            this.map.replaceNewLocationMarker(this.getLatLngFromForm());
            this.map.zoomTo(this.getLatLngFromForm());
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

    private getLatLngFromForm() {
        return latLng(this.formGroup.get('lat').value, this.formGroup.get('lng').value);
    }

    private setup() {
        this.formGroup.get('lat').valueChanges
            .pipe(debounceTime(300))
            .subscribe(value => {
                if (this.formGroup.get('lat').invalid || this.formGroup.get('lng').invalid) {
                    this.map.clearNewLocationMarker();
                    return;
                }

                this.convertCoordinates(value, this.formGroup.get('lng').value, 'latlng');
            });

        this.formGroup.get('lng').valueChanges
            .pipe(debounceTime(300))
            .subscribe(value => {
                if (this.formGroup.get('lat').invalid || this.formGroup.get('lng').invalid) {
                    this.map.clearNewLocationMarker();
                    return;
                }

                this.convertCoordinates(this.formGroup.get('lat').value, value, 'latlng');
            });

        this.formGroup.get('x').valueChanges.pipe(debounceTime(300))
            .subscribe(value => {
                if (this.formGroup.get('x').invalid || this.formGroup.get('y').invalid) {
                    return;
                }

                this.convertCoordinates(this.formGroup.get('y').value, value, 'lambert');
            });

        this.formGroup.get('y').valueChanges
            .pipe(debounceTime(300))
            .subscribe(value => {
                if (this.formGroup.get('x').invalid || this.formGroup.get('y').invalid) {
                    return;
                }

                this.convertCoordinates(value, this.formGroup.get('x').value, 'lambert');
            });
    }

    private convertCoordinates(lat: number, lng: number, source: string) {
        if (!this.convertingCoordinates) {
            this.convertingCoordinates = true;
            this.locationsService.convertCoordinates(lat, lng, source)
                .pipe(
                    take(1),
                )
                .subscribe(coordinates => {
                    console.log('converted the coordinates');
                    this.convertingCoordinates = true;
                    this.formGroup.get(source === 'latlng' ? 'x' : 'lat').setValue(coordinates.x, {emitEvent: false});
                    this.formGroup.get(source === 'latlng' ? 'y' : 'lng').setValue(coordinates.y, {emitEvent: false});

                    this.map.replaceNewLocationMarker(this.getLatLngFromForm());
                    this.convertingCoordinates = false;
                });
        }
    }
}

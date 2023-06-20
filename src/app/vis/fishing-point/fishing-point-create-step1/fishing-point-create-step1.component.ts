import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {LatLng, latLng} from 'leaflet';
import {Title} from '@angular/platform-browser';
import {UntypedFormGroup} from '@angular/forms';
import {debounceTime, take} from 'rxjs/operators';
import {FishingPointsMapComponent} from '../../components/fishing-points-map/fishing-points-map.component';
import {FishingPointsService} from '../../../services/vis.fishing-points.service';
import {IndexType} from '../../../domain/fishing-point/index-type';
import {FishingPointType} from '../fishing-point-create-page/fishing-point-type.enum';

@Component({
    selector: 'vis-fishing-point-create-step1',
    templateUrl: './fishing-point-create-step1.component.html',
})
export class FishingPointCreateStep1Component implements OnInit, AfterViewInit {

    readonly FishingPointType = FishingPointType;

    @ViewChild(FishingPointsMapComponent) map: FishingPointsMapComponent;

    @Input() formGroup: UntypedFormGroup;
    @Input() editMode: boolean;
    @Input() canEditIndexType: boolean;
    @Input() indexTypes: Array<IndexType>;
    @Input() fishingPointType: FishingPointType;

    @Output() fishingPointTypeChange = new EventEmitter<FishingPointType>();

    convertingCoordinates = false;

    constructor(private titleService: Title,
                private fishingPointsService: FishingPointsService) {
        this.titleService.setTitle('Vispunt toevoegen');
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
            this.map.replaceNewFishingPointMarker(this.getLatLngFromForm());
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

    onIsLenticModelChange(isLentic: boolean): void {
        this.fishingPointType = isLentic ? FishingPointType.STAGNANT : FishingPointType.FLOWING;
        this.fishingPointTypeChange.emit(this.fishingPointType) //noinspection UnresolvedVariable
    }

    private getLatLngFromForm() {
        return latLng(this.formGroup.get('lat').value, this.formGroup.get('lng').value);
    }

    private setup() {
        this.formGroup.get('lat').valueChanges
            .pipe(debounceTime(300))
            .subscribe(value => {
                if (this.formGroup.get('lat').invalid || this.formGroup.get('lng').invalid) {
                    this.map.clearNewFishingPointMarker();
                    return;
                }

                this.convertCoordinates(value, this.formGroup.get('lng').value, 'latlng');
            });

        this.formGroup.get('lng').valueChanges
            .pipe(debounceTime(300))
            .subscribe(value => {
                if (this.formGroup.get('lat').invalid || this.formGroup.get('lng').invalid) {
                    this.map.clearNewFishingPointMarker();
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
            this.fishingPointsService.convertCoordinates(lat, lng, source)
                .pipe(
                    take(1),
                )
                .subscribe(coordinates => {
                    this.convertingCoordinates = true;
                    this.formGroup.get(source === 'latlng' ? 'x' : 'lat').setValue(coordinates.x, {emitEvent: false});
                    this.formGroup.get(source === 'latlng' ? 'y' : 'lng').setValue(coordinates.y, {emitEvent: false});

                    this.map.replaceNewFishingPointMarker(this.getLatLngFromForm());
                    this.convertingCoordinates = false;
                });
        }
    }
}

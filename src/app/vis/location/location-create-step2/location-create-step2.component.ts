import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {FishingPointsMapComponent} from '../../components/fishing-points-map/fishing-points-map.component';
import {latLng} from 'leaflet';
import {FormGroup} from '@angular/forms';
import {VhaBlueLayerSelectionEvent} from '../../components/fishing-points-map/vha-blue-layer-selection-event.model';

@Component({
    selector: 'app-location-create-step2',
    templateUrl: './location-create-step2.component.html',
})
export class LocationCreateStep2Component implements OnInit {

    @ViewChild(FishingPointsMapComponent, {static: true}) map: FishingPointsMapComponent;

    @Input() formGroup: FormGroup;
    @Input() editMode = false;

    constructor(private titleService: Title) {
        this.titleService.setTitle('Locatie toevoegen');
    }

    ngOnInit(): void {
        const latlng = latLng(this.formGroup.get('lat').value, this.formGroup.get('lng').value);
        this.map.replaceNewLocationMarker(latlng);
        this.map.setCenter(latlng);
    }

    featureSelected(event: VhaBlueLayerSelectionEvent) {
        this.formGroup.get('vhaInfo').patchValue(event.infoProperties);
        this.formGroup.get('snappedLat').patchValue(event.coordinates.lat);
        this.formGroup.get('snappedLng').patchValue(event.coordinates.lng);
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
            max,
        };
    }

    get incline() {
        return this.formGroup.get('incline');
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

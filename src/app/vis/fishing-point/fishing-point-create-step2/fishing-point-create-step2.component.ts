import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {FishingPointsMapComponent} from '../../components/fishing-points-map/fishing-points-map.component';
import {latLng} from 'leaflet';
import {UntypedFormGroup} from '@angular/forms';
import {VhaBlueLayerSelectionEvent} from '../../components/fishing-points-map/vha-blue-layer-selection-event.model';
import {TownLayerSelectionEvent} from '../../components/fishing-points-map/town-layer-selection-event.model';

@Component({
    selector: 'vis-fishing-point-create-step2',
    templateUrl: './fishing-point-create-step2.component.html',
})
export class FishingPointCreateStep2Component implements OnInit {

    @ViewChild(FishingPointsMapComponent, {static: true}) map: FishingPointsMapComponent;

    @Input() formGroup: UntypedFormGroup;
    @Input() editMode = false;

    constructor(private titleService: Title) {
        this.titleService.setTitle('Locatie toevoegen');
    }

    ngOnInit(): void {
        const latlng = latLng(this.formGroup.get('lat').value, this.formGroup.get('lng').value);
        this.map.replaceNewFishingPointMarker(latlng);
        this.map.setCenter(latlng);
    }

    mapLoaded() {
        const latlng = latLng(this.formGroup.get('lat').value, this.formGroup.get('lng').value);
        this.map.updateTownLayerSelection(latlng, false);
    }

    featureSelected(event: VhaBlueLayerSelectionEvent) {
        this.formGroup.get('vhaBlueLayerId').patchValue(event.layerId);
        this.formGroup.get('vhaInfo').patchValue(event.infoProperties);
        this.formGroup.get('snappedLat').patchValue(event.coordinates.lat);
        this.formGroup.get('snappedLng').patchValue(event.coordinates.lng);
    }

    townSelected(event: TownLayerSelectionEvent) {
        this.formGroup.get('townLayerId').patchValue(event.layerId);
        this.formGroup.get('townInfo').patchValue(event.infoProperties);
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

    get townLayerId() {
        return this.formGroup.get('townLayerId').value;
    }

    get townInfoValue() {
        return this.formGroup.get('townInfo').value;
    }

    // Can be either: VHA_Waterlopen (id: 0) or BRU_hydro (id: 4)
    get vhaBlueLayerId() {
        return this.formGroup.get('vhaBlueLayerId').value;
    }

    get vhaInfoValue() {
        return this.formGroup.get('vhaInfo').value;
    }

    vhaInfoEmpty() {
        return this.formGroup.get('vhaInfo').invalid;
    }
}

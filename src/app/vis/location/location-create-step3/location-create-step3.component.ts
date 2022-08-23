import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FishingPointsMapComponent} from '../../components/fishing-points-map/fishing-points-map.component';
import {Title} from '@angular/platform-browser';
import {latLng} from 'leaflet';
import {VhaBlueLayerSelectionEvent} from '../../components/fishing-points-map/vha-blue-layer-selection-event.model';

@Component({
    selector: 'app-location-create-step3',
    templateUrl: './location-create-step3.component.html',
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

    featureSelected(event: VhaBlueLayerSelectionEvent) {
        this.formGroup.get('blueLayerInfo').patchValue(event.infoProperties);
        this.formGroup.get('snapX').patchValue(event.coordinates.x);
        this.formGroup.get('snapY').patchValue(event.coordinates.y);
    }

    townSelected(properties: any) {
        this.formGroup.get('townInfo').patchValue(properties);
    }

    onLoaded() {
        const latlng = latLng(this.formGroup.get('lat').value, this.formGroup.get('lng').value);
        this.map.updateTownLayerSelection(latlng);
    }

    get townInfoValue() {
        return this.formGroup.get('townInfo').value;
    }

    get blueLayerInfoValue() {
        return this.formGroup.get('blueLayerInfo').value;
    }

    blueLayerInfoEmpty() {
        return this.formGroup.get('blueLayerInfo').invalid;
    }
}

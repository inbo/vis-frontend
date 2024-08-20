import {ChangeDetectionStrategy, Component, Input, OnInit, ViewChild} from '@angular/core';
import {FishingPointsMapComponent} from '../../components/fishing-points-map/fishing-points-map.component';
import {LatLng, latLng} from 'leaflet';
import {UntypedFormGroup, Validators} from '@angular/forms';
import {VhaBlueLayerSelectionEvent} from '../../components/fishing-points-map/vha-blue-layer-selection-event.model';
import {TownLayerSelectionEvent} from '../../components/fishing-points-map/town-layer-selection-event.model';
import {Subscription} from 'rxjs';

@Component({
    selector: 'vis-fishing-point-create-step2',
    templateUrl: './fishing-point-create-step2.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FishingPointCreateStep2Component implements OnInit {

    @ViewChild(FishingPointsMapComponent, {static: true}) map: FishingPointsMapComponent;

    @Input() formGroup: UntypedFormGroup;
    @Input() editMode = false;
    @Input() submitted: boolean;

    private subscription = new Subscription();

    ngOnInit(): void {
        const latlng = latLng(this.formGroup.get('lat').value, this.formGroup.get('lng').value);
        this.map.replaceNewFishingPointMarker(latlng);
        this.map.setCenter(latlng);
        this.setupCountryCodeValidation();
    }

    mapLoaded() {
        const latlng = latLng(this.formGroup.get('lat').value, this.formGroup.get('lng').value);
        this.map.updateTownLayerSelection(latlng, false);
    }

    featureSelected(event: VhaBlueLayerSelectionEvent) {
        this.clearFeatureSelection();
        this.formGroup.get('vhaBlueLayerId').patchValue(event.layerId);
        this.formGroup.get('vhaInfo').patchValue(event.infoProperties);
        this.formGroup.get('snappedLat').patchValue(event.coordinates.lat);
        this.formGroup.get('snappedLng').patchValue(event.coordinates.lng);
        this.formGroup.get('noPointOnMap').patchValue(false);
    }

    townSelected(event: TownLayerSelectionEvent) {
        this.clearTownSelection();
        this.formGroup.get('townLayerId').patchValue(event.layerId);
        this.formGroup.get('townInfo').patchValue(event.infoProperties);
    }

    clearFeatureSelection() {
        this.formGroup.get('vhaBlueLayerId').patchValue(null);
        this.formGroup.get('vhaInfo').patchValue(null);
        this.formGroup.get('snappedLat').patchValue(null);
        this.formGroup.get('snappedLng').patchValue(null);
        this.formGroup.get('noPointOnMap').patchValue(false);
    }

    clearTownSelection() {
        this.formGroup.get('townLayerId').patchValue(null);
        this.formGroup.get('townInfo').patchValue(null);
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

    get vhaInfoEmpty() {
        return this.formGroup.get('vhaInfo').invalid;
    }

    get noPointOnMap() {
        return this.formGroup.get('noPointOnMap')?.value;
    }

    get isLentic() {
        return this.formGroup.get('isLentic')?.value;
    }

  get countryCodeFormControl() {
    return this.formGroup.get('countryCode');
  }

  onMapClick() {
    this.clearFeatureSelection();
    this.clearTownSelection();
  }

  private setupCountryCodeValidation() {
    this.subscription.add(this.formGroup.get('townInfo')?.valueChanges.subscribe((value) => {
      this.updateCountryCodeValidators(value);
    }));
  }

  private updateCountryCodeValidators(townInfoValue: any) {
    const countryCodeControl = this.formGroup.get('countryCode');

    if (!townInfoValue) {
      countryCodeControl?.setValidators(Validators.required);
    } else {
      countryCodeControl?.clearValidators();
    }
    countryCodeControl?.updateValueAndValidity();
  }
}

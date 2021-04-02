import {Component, OnInit} from '@angular/core';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {BreadcrumbLink} from '../../../shared-ui/breadcrumb/BreadcrumbLinks';
import {Title} from '@angular/platform-browser';
import 'esri-leaflet-renderers';
import {AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {LocationsService} from '../../../services/vis.locations.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-location-create-page',
  templateUrl: './location-create-page.component.html'
})
export class LocationCreatePageComponent implements OnInit {
  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Locaties', url: '/locaties'},
    {title: 'Aanmaken', url: '/locaties/create'},
  ];

  currentStep = 1;

  formGroup: FormGroup;

  constructor(private titleService: Title, private formBuilder: FormBuilder, private locationsService: LocationsService) {
    this.titleService.setTitle('Locatie toevoegen');
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group(
      {
        lat: [null, [Validators.required, Validators.pattern('^(\\-?([0-8]?[0-9](\\.\\d+)?|90(.[0]+)?))')]],
        lng: [null, [Validators.required, Validators.pattern('^(\\-?([1]?[0-7]?[0-9](\\.\\d+)?|180((.[0]+)?)))$')]],
        code: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(15)], [this.codeValidator()]],
        name: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(2000)]],
        type: [null, [Validators.required]],
        vhaInfo: [null, [Validators.required]],
        blueLayerInfo: [null, [Validators.required]],
        vhaZone: [null, [Validators.required]],
      },
    );
  }

  codeValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.locationsService.checkIfFishingPointExists(control.value)
        .pipe(map(result => result.valid ? {unique: true} : null));
    };
  }

  isStep1Valid(): boolean {
    return this.formGroup.get('lat').valid
      && this.formGroup.get('lng').valid
      && this.formGroup.get('code').valid
      && this.formGroup.get('name').valid
      && this.formGroup.get('type').valid;
  }

  isStep2Valid(): boolean {
    return this.isStep1Valid()
      && this.formGroup.get('vhaInfo').valid
      && this.formGroup.get('vhaZone').valid;
  }

  isStep3Valid(): boolean {
    return this.isStep1Valid()
      && this.formGroup.get('blueLayerInfo').valid
      && this.formGroup.get('vhaZone').valid;
  }

  isTypeFlowing() {
    return this.formGroup.get('type').value === 'flowing';
  }

  isTypeStationary() {
    return this.formGroup.get('type').value === 'stationary';
  }

  save() {
    console.log(this.formGroup.getRawValue());
  }
}

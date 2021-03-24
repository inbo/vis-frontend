import {Component, OnInit} from '@angular/core';
import {NavigationLink} from "../../../shared-ui/layouts/NavigationLinks";
import {GlobalConstants} from "../../../GlobalConstants";
import {BreadcrumbLink} from "../../../shared-ui/breadcrumb/BreadcrumbLinks";
import {Title} from "@angular/platform-browser";
import "esri-leaflet-renderers"
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import * as L from 'leaflet';

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

  constructor(private titleService: Title, private formBuilder: FormBuilder) {
    this.titleService.setTitle('Locatie toevoegen');
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group(
      {
        lat: [null, [Validators.required, Validators.pattern('^(\\-?([0-8]?[0-9](\\.\\d+)?|90(.[0]+)?))')]],
        lng: [null, [Validators.required, Validators.pattern('^(\\-?([1]?[0-7]?[0-9](\\.\\d+)?|180((.[0]+)?)))$')]],
        code: [null, [Validators.required, Validators.minLength(1)]],
        name: [null, [Validators.required, Validators.minLength(1)]],
        type: [null, [Validators.required]],
        waterway: [null, [Validators.required]],
      },
    );
  }

  isStep1Valid(): boolean {
    return this.formGroup.get('lat').valid
      && this.formGroup.get('lng').valid
      && this.formGroup.get('code').valid
      && this.formGroup.get('name').valid
      && this.formGroup.get('type').valid
  }

  isStep2Valid(): boolean {
    return this.isStep1Valid()
      && this.formGroup.get('waterway').valid
  }

  isTypeFlowing() {
    return this.formGroup.get('type').value === 'flowing'
  }

  isTypeStationary() {
    return this.formGroup.get('type').value === 'stationary'
  }
}

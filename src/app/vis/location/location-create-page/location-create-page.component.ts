import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {BreadcrumbLink} from '../../../shared-ui/breadcrumb/BreadcrumbLinks';
import {Title} from '@angular/platform-browser';
import 'esri-leaflet-renderers';
import {AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {LocationsService} from '../../../services/vis.locations.service';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'app-location-create-page',
  templateUrl: './location-create-page.component.html'
})
export class LocationCreatePageComponent implements OnInit, OnDestroy {
  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Locaties', url: '/locaties'},
    {title: 'Aanmaken', url: '/locaties/create'},
  ];

  currentStep = 1;

  formGroup: FormGroup;

  private subscription = new Subscription();

  constructor(private titleService: Title,
              private formBuilder: FormBuilder,
              private locationsService: LocationsService,
              private router: Router) {
    this.titleService.setTitle('Locatie toevoegen');
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group(
      {
        lat: [null, [Validators.required, Validators.pattern('^(\\-?([0-8]?[0-9](\\.\\d+)?|90(.[0]+)?))')]],
        lng: [null, [Validators.required, Validators.pattern('^(\\-?([1]?[0-7]?[0-9](\\.\\d+)?|180((.[0]+)?)))$')]],
        x: [null, [Validators.required, Validators.pattern('^\\d+(\\.\\d+)?$')]],
        y: [null, [Validators.required, Validators.pattern('^\\d+(\\.\\d+)?$')]],
        code: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(15)], [this.codeValidator()]],
        description: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(2000)]],
        slope: [null, [Validators.min(0), Validators.max(99999.999)]],
        width: [null, [Validators.min(0), Validators.max(99999.999)]],
        type: [null, [Validators.required]],
        vhaInfo: [null, [Validators.required]],
        blueLayerInfo: [null, [Validators.required]],
        townInfo: [null, [Validators.required]],
      },
    );
  }

  codeValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.locationsService.checkIfFishingPointExists(control.value)
        .pipe(map(result => result.valid ? {uniqueCode: true} : null));
    };
  }

  isStep1Valid(): boolean {
    return this.formGroup.get('lat').valid
      && this.formGroup.get('lng').valid
      && this.formGroup.get('code').valid
      && this.formGroup.get('description').valid
      && this.formGroup.get('type').valid;
  }

  isStep2Valid(): boolean {
    return this.isStep1Valid()
      && this.formGroup.get('vhaInfo').valid
      && this.formGroup.get('townInfo').valid;
  }

  isStep3Valid(): boolean {
    return this.isStep1Valid()
      && this.formGroup.get('blueLayerInfo').valid
      && this.formGroup.get('townInfo').valid;
  }

  isTypeFlowing() {
    return this.formGroup.get('type').value === 'flowing';
  }

  isTypeStationary() {
    return this.formGroup.get('type').value === 'stationary';
  }

  save() {
    this.subscription.add(
      this.locationsService.create(this.formGroup.getRawValue()).subscribe(() => {
        this.router.navigate(['/locaties', this.formGroup.get('code').value]);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

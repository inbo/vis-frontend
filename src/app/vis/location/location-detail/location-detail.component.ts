import {Component, OnInit, ViewChild} from '@angular/core';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {BreadcrumbLink} from '../../../shared-ui/breadcrumb/BreadcrumbLinks';
import {LocationsService} from '../../../services/vis.locations.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FishingPoint} from '../../../domain/location/fishing-point';
import {latLng} from 'leaflet';
import {FishingPointsMapComponent} from '../../components/fishing-points-map/fishing-points-map.component';
import {AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';

@Component({
  selector: 'app-location-detail',
  templateUrl: './location-detail.component.html'
})
export class LocationDetailComponent implements OnInit {
  @ViewChild(FishingPointsMapComponent, {static: true}) map: FishingPointsMapComponent;

  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Locaties', url: '/locaties'},
  ];

  fishingPoint: FishingPoint;
  editMode = false;
  formGroup: FormGroup;
  submitted = false;
  isDeleteModalOpen = false;
  canDelete = false;

  constructor(private locationsService: LocationsService, private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder,
              private router: Router) {
  }

  ngOnInit(): void {
    this.loadFishingPoint();


  }

  private loadFishingPoint() {
    const code = this.activatedRoute.snapshot.params.code;
    this.locationsService.findByCode(code).subscribe(value => {
      this.fishingPoint = value;
      const latlng = latLng(this.fishingPoint.lat, this.fishingPoint.lng);
      this.map.setCenter(latlng);

      this.formGroup = this.formBuilder.group(
        {
          code: [value.code, [Validators.required, Validators.minLength(1), Validators.maxLength(15)], [this.codeValidator()]],
          description: [value.description, [Validators.required, Validators.minLength(1), Validators.maxLength(2000)]],
          slope: [value.incline ? value.incline.toString() : null, [Validators.min(0), Validators.max(99999.999)]],
          width: [value.width ? value.width.toString() : null, [Validators.min(0), Validators.max(99999.999)]],
          brackfishWater: [value.brackfishWater, [Validators.min(0), Validators.max(99999.999)]],
          titalWater: [value.titalWater, [Validators.min(0), Validators.max(99999.999)]],
        },
      );
    });
  }

  codeValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.locationsService.checkIfFishingPointExists(control.value)
        .pipe(map(result => {
          if (this.fishingPoint.code === control.value) {
            return null;
          }
          return result.valid ? {uniqueCode: true} : null;
        }));
    };
  }

  get code() {
    return this.formGroup.get('code');
  }

  get description() {
    return this.formGroup.get('description');
  }

  get slope() {
    return this.formGroup.get('slope');
  }

  get width() {
    return this.formGroup.get('width');
  }

  get brackfishWater() {
    return this.formGroup.get('brackfishWater');
  }

  get titalWater() {
    return this.formGroup.get('titalWater');
  }

  numberMask(scale: number, min: number, max: number) {
    return {
      mask: Number,
      scale,
      signed: true,
      thousandsSeparator: '',
      radix: ',',
      min,
      max
    };
  }

  cancel() {
    this.editMode = false;
  }

  save() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }

    const rawValue = this.formGroup.getRawValue();
    this.locationsService.updateLocation(this.fishingPoint.id, rawValue).pipe(take(1)).subscribe(() => {
      this.loadFishingPoint();
      this.submitted = false;
      this.editMode = false;
    });
  }

  remove() {
    this.locationsService.canDeleteFishingPoint(this.fishingPoint.id).subscribe(value => {
      this.canDelete = value;
      this.isDeleteModalOpen = true;
    });
  }

  cancelModal() {
    this.isDeleteModalOpen = false;
  }

  confirmDeleteClicked() {
    if (this.canDelete) {
      this.locationsService.deleteFishingPoint(this.fishingPoint.id).subscribe(value => {
        this.router.navigate(['/locaties']);
      });
    } else {
      this.isDeleteModalOpen = false;
    }
  }
}

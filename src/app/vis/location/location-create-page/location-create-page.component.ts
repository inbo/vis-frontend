import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {BreadcrumbLink} from '../../../shared-ui/breadcrumb/BreadcrumbLinks';
import {Title} from '@angular/platform-browser';
import 'esri-leaflet-renderers';
import {AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Observable, of, Subscription} from 'rxjs';
import {LocationsService} from '../../../services/vis.locations.service';
import {map, take, tap} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {FishingPoint} from '../../../domain/location/fishing-point';
import {AuthService} from '../../../core/auth.service';
import {Role} from '../../../core/_models/role';
import {IndexType} from '../../../domain/location/index-type';
import {FishingPointType} from './fishing-point-type.enum';
import {FishingPointCreationStep} from './location-creation-step.enum';
import {Location} from '@angular/common';

@Component({
    selector: 'app-location-create-page',
    templateUrl: './location-create-page.component.html',
})
export class LocationCreatePageComponent implements OnInit, OnDestroy {

    static readonly FISHING_POINT_ID_QP = 'fishingPointId';
    readonly FishingPointType = FishingPointType;
    readonly LocationCreationStep = FishingPointCreationStep;

    editMode = false;
    links: Array<NavigationLink> = GlobalConstants.links;
    breadcrumbLinks: Array<BreadcrumbLink> = [
        {title: 'Locaties', url: '/locaties'},
        {title: 'Aanmaken', url: '/locaties/create'},
    ];

    currentStep = FishingPointCreationStep.GENERAL;

    formGroup: FormGroup;
    originalFishingPoint: FishingPoint;
    fishingPointType = FishingPointType.STAGNANT;
    canEditIndexType = false;
    indexTypes: Array<IndexType> = [];

    private subscription = new Subscription();

    constructor(private titleService: Title,
                private formBuilder: FormBuilder,
                private locationsService: LocationsService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private authService: AuthService,
                private location: Location) {
        this.titleService.setTitle('Locatie toevoegen');
    }

    ngOnInit(): void {
        this.canEditIndexType = this.authService.hasRole(Role.EditIndexType);
        let initialization: Observable<FishingPoint> = of({} as FishingPoint);
        let controlsConfig: { [key: string]: any } = {
            lat: [null, [Validators.required, Validators.pattern('^(\\-?([0-8]?[0-9](\\.\\d+)?|90(.[0]+)?))')]],
            lng: [null, [Validators.required, Validators.pattern('^(\\-?([1]?[0-7]?[0-9](\\.\\d+)?|180((.[0]+)?)))$')]],
            x: [null, [Validators.required, Validators.pattern('^\\d+(\\.\\d+)?$')]],
            y: [null, [Validators.required, Validators.pattern('^\\d+(\\.\\d+)?$')]],
            description: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(2000)]],
            incline: [null, [Validators.min(0), Validators.max(99999.999)]],
            width: [null, [Validators.min(0), Validators.max(99999.999)]],
        };
        if (this.activatedRoute.snapshot.queryParamMap.has(LocationCreatePageComponent.FISHING_POINT_ID_QP)) {
            const fishingPointId = this.activatedRoute.snapshot.queryParamMap.get(LocationCreatePageComponent.FISHING_POINT_ID_QP);
            initialization = this.locationsService
                .findById(parseInt(fishingPointId, 10))
                .pipe(
                    tap(() => this.editMode = true),
                    tap(() => this.breadcrumbLinks[1].title = 'Bewerken'),
                    tap(() => {
                        controlsConfig = {
                            ...controlsConfig,
                            brackishWater: [null],
                            tidalWater: [null],
                        };
                    }),
                    tap(() => {
                        if (this.authService.hasRole(Role.EditIndexType)) {
                            controlsConfig = {
                                ...controlsConfig,
                                fishingIndexType: [null],
                            };
                        }
                    }),
                    tap(fishingPoint => {
                        this.fishingPointType = fishingPoint.isLentic ? FishingPointType.STAGNANT : FishingPointType.FLOWING;
                        this.originalFishingPoint = {...fishingPoint};
                    }),
                    tap(() => {
                        this.locationsService
                            .listIndexTypes()
                            .pipe(take(1))
                            .subscribe(indexTypes => this.indexTypes = indexTypes);
                    }));
        }
        initialization.subscribe(fishingPoint => {
            this.formGroup = this.formBuilder.group(
                {
                    ...controlsConfig,
                    ...(fishingPoint.id ? {id: [fishingPoint.id]} : {}),
                    vhaBlueLayerId: [null],
                    vhaInfo: [null, [Validators.required]],
                    blueLayerInfo: [null, [Validators.required]],
                    townLayerId: [null],
                    townInfo: [null, [Validators.required]],
                    snappedLat: [null],
                    snappedLng: [null],
                    code: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(15)],
                        [this.codeValidator(fishingPoint)]],
                },
            );
            this.formGroup.patchValue(fishingPoint);
            this.formGroup.updateValueAndValidity();
        });
    }

    codeValidator(fishingPoint: FishingPoint): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            if (fishingPoint.code === control.value) {
                return of(null);
            }
            return this.locationsService.checkIfFishingPointExists(control.value)
                .pipe(map(result => result.valid ? {uniqueCode: true} : null));
        };
    }

    isGeneralStepValid(): boolean {
        let result = this.formGroup?.get('lat').valid
            && this.formGroup?.get('lng').valid
            && this.formGroup?.get('code').valid
            && this.formGroup?.get('description').valid;
        if (this.editMode) {
            result = result
                && this.formGroup?.get('brackishWater').valid
                && this.formGroup?.get('tidalWater').valid
                && this.formGroup?.get('fishingIndexType').valid;
        } else {
            result = result && this.fishingPointType !== undefined;
        }
        return result;
    }

    isWaterCourseValid(): boolean {
        if (this.editMode) {
            return true;
        }
        return this.isGeneralStepValid()
            && this.formGroup?.get('vhaInfo').valid
            && this.formGroup?.get('townInfo').valid;
    }

    isBlueLayerValid(): boolean {
        return this.isGeneralStepValid()
            && this.formGroup?.get('blueLayerInfo').valid
            && this.formGroup?.get('townInfo').valid;
    }

    goToNextStep(): void {
        if (this.editMode && this.fishingPointType === FishingPointType.STAGNANT) {
            this.save();
            return;
        }
        if (this.fishingPointType === FishingPointType.STAGNANT) {
            this.currentStep = FishingPointCreationStep.BLUE_LAYER;
        } else {
            this.currentStep = FishingPointCreationStep.WATER_COURSE;
        }
    }

    save() {
        if (this.editMode) {
            this.locationsService
                .updateLocation(this.formGroup.get('id').value, this.formGroup.getRawValue())
                .subscribe(
                    () => this.router.navigate(['/locaties', this.formGroup.get('code').value]),
                );
        } else {
            this.subscription.add(
                this.locationsService.create(this.formGroup.getRawValue()).subscribe(() => {
                    this.router.navigate(['/locaties', this.formGroup.get('code').value]);
                }),
            );
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    cancel() {
        this.location.back();
    }
}

import {Component, OnInit, ViewChild} from '@angular/core';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {BreadcrumbLink} from '../../../shared-ui/breadcrumb/BreadcrumbLinks';
import {LocationsService} from '../../../services/vis.locations.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FishingPoint} from '../../../domain/location/fishing-point';
import {LatLng} from 'leaflet';
import {FishingPointsMapComponent} from '../../components/fishing-points-map/fishing-points-map.component';
import {AbstractControl, AsyncValidatorFn, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {Role} from '../../../core/_models/role';
import {IndexType} from '../../../domain/location/index-type';
import {AuthService} from '../../../core/auth.service';
import {LocationCreatePageComponent} from '../location-create-page/location-create-page.component';

@Component({
    selector: 'app-location-detail',
    templateUrl: './location-detail.component.html',
})
export class LocationDetailComponent implements OnInit {

    readonly EDIT_FISHING_POINT_ID_QP = LocationCreatePageComponent.FISHING_POINT_ID_QP;

    @ViewChild(FishingPointsMapComponent, {static: true}) fishingPointsMap: FishingPointsMapComponent;

    role = Role;

    links: NavigationLink[] = GlobalConstants.links;
    breadcrumbLinks: BreadcrumbLink[] = [
        {title: 'Locaties', url: '/locaties'},
    ];

    fishingPoint: FishingPoint;
    formGroup: UntypedFormGroup;
    submitted = false;
    isDeleteModalOpen = false;
    canDelete = false;

    indexTypes$: Observable<IndexType[]>;
    editQueryParams: Params;
    mapLoaded = false;

    constructor(private locationsService: LocationsService,
                private activatedRoute: ActivatedRoute,
                private formBuilder: UntypedFormBuilder,
                private router: Router,
                public authService: AuthService) {
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

    get brackishWater() {
        return this.formGroup.get('brackishWater');
    }

    get tidalWater() {
        return this.formGroup.get('tidalWater');
    }

    ngOnInit(): void {
        this.loadFishingPoint();
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
            this.locationsService.deleteFishingPoint(this.fishingPoint.id).subscribe(() => {
                this.router.navigate(['/locaties']);
            });
        } else {
            this.isDeleteModalOpen = false;
        }
    }

    highlightFishingPoint() {
        this.fishingPointsMap.zoomTo(new LatLng(this.fishingPoint.lat, this.fishingPoint.lng));
    }

    editFishingPoint() {
        this.router
            .navigate(
                ['/locaties/create'],
                {queryParams: {[LocationCreatePageComponent.FISHING_POINT_ID_QP]: `${this.fishingPoint.id}`}},
            );
    }

    setMapLoaded() {
        this.mapLoaded = true;
    }

    private loadFishingPoint() {
        const code = this.activatedRoute.snapshot.params.code;
        this.locationsService
            .findByCode(code)
            .subscribe(value => {
                this.fishingPoint = value;
                const latlng = new LatLng(this.fishingPoint.lat, this.fishingPoint.lng);
                this.fishingPointsMap.setCenter(latlng);

                this.formGroup = this.formBuilder.group(
                    {
                        code: [value.code, [Validators.required, Validators.minLength(1), Validators.maxLength(15)], [this.codeValidator()]],
                        description: [value.description, [Validators.required, Validators.minLength(1), Validators.maxLength(2000)]],
                        slope: [value.incline ? value.incline.toString() : null, [Validators.min(0), Validators.max(99999.999)]],
                        width: [value.width ? value.width.toString() : null, [Validators.min(0), Validators.max(99999.999)]],
                        brackishWater: [value.brackishWater, [Validators.min(0), Validators.max(99999.999)]],
                        tidalWater: [value.tidalWater, [Validators.min(0), Validators.max(99999.999)]],
                        indexType: [value.fishingIndexType],
                    },
                );
                this.editQueryParams = {[this.EDIT_FISHING_POINT_ID_QP]: value.id};
                if (this.mapLoaded) {
                    this.highlightFishingPoint();
                } else {
                    this.fishingPointsMap.loaded.pipe(take(1)).subscribe(() => this.highlightFishingPoint());
                }
            });

        this.indexTypes$ = this.locationsService.listIndexTypes();
    }
}

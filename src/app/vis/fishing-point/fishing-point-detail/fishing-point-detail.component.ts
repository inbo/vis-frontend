import {Component, OnInit, ViewChild} from '@angular/core';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {BreadcrumbLink} from '../../../shared-ui/breadcrumb/BreadcrumbLinks';
import {FishingPointsService} from '../../../services/vis.fishing-points.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FishingPoint} from '../../../domain/fishing-point/fishing-point';
import {LatLng} from 'leaflet';
import {FishingPointsMapComponent} from '../../components/fishing-points-map/fishing-points-map.component';
import {
    AbstractControl,
    AsyncValidatorFn,
    UntypedFormBuilder,
    UntypedFormGroup,
    ValidationErrors,
    Validators,
} from '@angular/forms';
import {Observable, switchMap} from 'rxjs';
import {map, take, tap} from 'rxjs/operators';
import {Role} from '../../../core/_models/role';
import {IndexType} from '../../../domain/fishing-point/index-type';
import {AuthService} from '../../../core/auth.service';
import {FishingPointCreatePageComponent} from '../fishing-point-create-page/fishing-point-create-page.component';

@Component({
    selector: 'vis-fishing-point-detail',
    templateUrl: './fishing-point-detail.component.html',
})
export class FishingPointDetailComponent implements OnInit {

    readonly EDIT_FISHING_POINT_ID_QP = FishingPointCreatePageComponent.FISHING_POINT_ID_QP;

    @ViewChild(FishingPointsMapComponent, {static: true}) fishingPointsMap: FishingPointsMapComponent;

    role = Role;

    links: NavigationLink[] = GlobalConstants.links;
    breadcrumbLinks: BreadcrumbLink[] = [
        {title: 'Vispunten', url: '/vispunten'},
    ];

    fishingPoint: FishingPoint;
    formGroup: UntypedFormGroup;
    submitted = false;
    isDeleteModalOpen = false;
    canDelete = false;

    indexTypes$: Observable<IndexType[]>;
    editQueryParams: Params;
    mapLoaded = false;

    constructor(private fishingPointsService: FishingPointsService,
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
            return this.fishingPointsService.checkIfFishingPointExists(control.value)
                .pipe(map(result => {
                    if (this.fishingPoint.code === control.value) {
                        return null;
                    }
                    return result.valid ? {uniqueCode: true} : null;
                }));
        };
    }

    remove() {
        this.fishingPointsService
            .canDeleteFishingPoint(this.fishingPoint.id)
            .pipe(take(1))
            .subscribe(value => {
                this.canDelete = value;
                this.isDeleteModalOpen = true;
            });
    }

    cancelModal() {
        this.isDeleteModalOpen = false;
    }

    confirmDeleteClicked() {
        if (this.canDelete) {
            this.fishingPointsService.deleteFishingPoint(this.fishingPoint.id).subscribe(() => {
                this.router.navigate(['/vispunten']);
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
                ['/vispunten/create'],
                {queryParams: {[FishingPointCreatePageComponent.FISHING_POINT_ID_QP]: `${this.fishingPoint.id}`}},
            );
    }

    setMapLoaded() {
        this.mapLoaded = true;
    }

    private loadFishingPoint() {
        const code = this.activatedRoute.snapshot.params.code;
        this.fishingPointsService
            .findByCode(code)
            .pipe(
                tap(value => {
                    this.fishingPoint = value;
                    const latlng = new LatLng(this.fishingPoint.lat, this.fishingPoint.lng);
                    this.fishingPointsMap.setCenter(latlng);

                    this.formGroup = this.formBuilder.group(
                        {
                            code: [value.code, [Validators.required, Validators.minLength(1), Validators.maxLength(30)], [this.codeValidator()]],
                            description: [value.description, [Validators.required, Validators.minLength(1), Validators.maxLength(2000)]],
                            slope: [value.incline ? value.incline.toString() : null, [Validators.min(0), Validators.max(99999.999)]],
                            width: [value.width ? value.width.toString() : null, [Validators.min(0), Validators.max(99999.999)]],
                            brackishWater: [value.brackishWater, [Validators.min(0), Validators.max(99999.999)]],
                            tidalWater: [value.tidalWater, [Validators.min(0), Validators.max(99999.999)]],
                            indexType: [value.fishingIndexType],
                        },
                    );
                    this.editQueryParams = {[this.EDIT_FISHING_POINT_ID_QP]: value.id};
                }),
                switchMap(() => this.fishingPointsMap.loaded),
            )
            .subscribe(() => {
                this.highlightFishingPoint();
            });

        this.indexTypes$ = this.fishingPointsService.listIndexTypes();
    }
}

import {Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {Title} from '@angular/platform-browser';
import {BreadcrumbLink} from '../../../shared-ui/breadcrumb/BreadcrumbLinks';
import {AsyncPage} from '../../../shared-ui/paging-async/asyncPage';
import {Subscription} from 'rxjs';
import {FishingPoint} from '../../../domain/location/fishing-point';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {LocationsService} from '../../../services/vis.locations.service';
import {FishingPointsMapComponent} from '../../components/fishing-points-map/fishing-points-map.component';
import {LatLng} from 'leaflet';
import {Role} from '../../../core/_models/role';
import {getTag, Tag} from '../../../shared-ui/slide-over-filter/tag';
import {FormBuilder, FormGroup} from '@angular/forms';
import {map, take} from 'rxjs/operators';
import {SearchableSelectOption} from '../../../shared-ui/searchable-select/SearchableSelectOption';
import {
    SearchableSelectConfig,
    SearchableSelectConfigBuilder,
} from '../../../shared-ui/searchable-select/SearchableSelectConfig';

@Component({
    selector: 'app-location-overview-page',
    templateUrl: './location-overview-page.component.html',
})
export class LocationOverviewPageComponent implements OnInit, OnDestroy {

    links: NavigationLink[] = GlobalConstants.links;
    breadcrumbLinks: BreadcrumbLink[] = [
        {title: 'Locaties', url: '/locaties'},
    ];

    @ViewChild(FishingPointsMapComponent) map: FishingPointsMapComponent;
    @ViewChild(FishingPointsMapComponent, {read: ElementRef}) mapElement: ElementRef;
    @ViewChild('filename') filenameInput: ElementRef;
    @ViewChildren('checkbox') checkboxes: QueryList<ElementRef<HTMLInputElement>>;
    @ViewChild('checkboxAll') checkboxAll: ElementRef<HTMLInputElement>;

    loading = false;
    pager: AsyncPage<FishingPoint>;
    fishingPoints: FishingPoint[];
    role = Role;

    tags: Tag[] = [];
    filterForm: FormGroup;

    highlightedLocation: number;
    private subscription = new Subscription();

    locationCodesToExport: string[] = [];
    exportMode = false;

    watercourses: SearchableSelectOption[] = [];
    lenticWaterbodies: SearchableSelectOption[] = [];
    provinces: SearchableSelectOption[] = [];
    municipalities: SearchableSelectOption[] = [];
    basins: SearchableSelectOption[] = [];
    fishingPointCodes: SearchableSelectOption[] = [];
    fishingPointSearchableSelectConfig: SearchableSelectConfig;

    constructor(private titleService: Title, private locationsService: LocationsService, private activatedRoute: ActivatedRoute,
                private router: Router, private formBuilder: FormBuilder) {
        this.titleService.setTitle('Locaties');

        this.fishingPointSearchableSelectConfig = new SearchableSelectConfigBuilder()
            .minQueryLength(2)
            .searchPlaceholder('Minstens 2 karakters...')
            .build();
    }

    ngOnInit(): void {
        const queryParams = this.activatedRoute.snapshot.queryParams;
        this.filterForm = this.formBuilder.group(
            {
                fishingPointCodeFree: [queryParams.fishingPointCodeFree ?? null],
                fishingPointCode: [queryParams.fishingPointCode ?? null],
                description: [queryParams.description ?? null],
                watercourse: [queryParams.watercourse ?? null],
                lenticWaterbody: [queryParams.lenticWaterbody ?? null],
                basin: [queryParams.basin ?? null],
                province: [queryParams.province ?? null],
                municipality: [queryParams.municipality ?? null],
                page: [queryParams.page ?? null],
                size: [queryParams.size ?? null],
                sort: [queryParams.sort ?? null],
            },
        );

        this.subscription.add(this.activatedRoute.queryParams.subscribe((params) => {
            this.filterForm.get('fishingPointCodeFree').patchValue(params.fishingPointCodeFree ? params.fishingPointCodeFree : null);
            this.filterForm.get('fishingPointCode').patchValue(params.fishingPointCode ? params.fishingPointCode : null);
            this.filterForm.get('description').patchValue(params.description ? params.description : null);
            this.filterForm.get('watercourse').patchValue(params.watercourse ? params.watercourse : null);
            this.filterForm.get('lenticWaterbody').patchValue(params.lenticWaterbody ? params.lenticWaterbody : null);
            this.filterForm.get('basin').patchValue(params.basin ? params.basin : null);
            this.filterForm.get('province').patchValue(params.province ? params.province : null);
            this.filterForm.get('municipality').patchValue(params.municipality ? params.municipality : null);
            this.filterForm.get('page').patchValue(params.page ? params.page : null);
            this.filterForm.get('size').patchValue(params.size ? params.size : null);
            this.filterForm.get('sort').patchValue(params.sort ? params.sort : null);

            this.getWatercourses(queryParams.watercourse ? queryParams.watercourse : null);
            this.getLenticWaterbodies(queryParams.lenticWaterbody ? queryParams.lenticWaterbody : null);
            this.getProvinces(queryParams.province ? queryParams.province : null);
            this.getMunicipalities(queryParams.municipality ? queryParams.municipality : null);
            this.getBasins(queryParams.basin ? queryParams.basin : null);
            this.getFishingPointCodes(queryParams.fishingPointCode ? queryParams.fishingPointCode : null);

            if (this.map) {
                this.map.updateFishingPointsLayer(this.filterForm.getRawValue());
            }
            this.getFishingPoints();
        }));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    zoomToLocation(fishingPoint: FishingPoint) {
        this.highlightedLocation = fishingPoint.id;

        const latlng = new LatLng(fishingPoint.lat, fishingPoint.lng);
        this.map.zoomTo(latlng);
        this.mapElement.nativeElement.scrollIntoView();
    }

    getFishingPoints() {
        this.setTags();

        this.loading = true;
        this.fishingPoints = [];

        const filter = this.filterForm?.getRawValue();
        const page = this.filterForm.get('page').value ?? 0;
        const size = this.filterForm.get('size').value ?? 20;

        this.locationsService
            .getFishingPoints(page, size, filter)
            .pipe(
                take(1),
            )
            .subscribe((value) => {
                this.pager = value;
                this.fishingPoints = value.content;
                this.loading = false;
            });
    }

    filter() {
        const rawValue = this.filterForm.getRawValue();

        const queryParams: Params = {...rawValue};
        queryParams.page = 1;

        this.router.navigate(
            [],
            {
                relativeTo: this.activatedRoute,
                queryParams,
            });
    }

    reset() {
        this.filterForm.reset();
    }

    private setTags() {
        const rawValue = this.filterForm.getRawValue();
        const tags: Tag[] = [];

        if (rawValue.fishingPointCodeFree) {
            tags.push(getTag('location.fishingPointCodeFree', rawValue.fishingPointCodeFree, this.removeTagCallback('fishingPointCodeFree')));
        }
        if (rawValue.fishingPointCode) {
            tags.push(getTag('location.fishingPointCode', rawValue.fishingPointCode, this.removeTagCallback('fishingPointCode')));
        }
        if (rawValue.description) {
            tags.push(getTag('location.description', rawValue.description, this.removeTagCallback('description')));
        }
        if (rawValue.watercourse) {
            tags.push(getTag('location.watercourse', rawValue.watercourse, this.removeTagCallback('watercourse')));
        }
        if (rawValue.lenticWaterbody) {
            tags.push(getTag('location.lenticWaterbody', rawValue.lenticWaterbody, this.removeTagCallback('lenticWaterbody')));
        }
        if (rawValue.basin) {
            tags.push(getTag('location.basin', rawValue.basin, this.removeTagCallback('basin')));
        }
        if (rawValue.province) {
            tags.push(getTag('location.province', rawValue.province, this.removeTagCallback('province')));
        }
        if (rawValue.municipality) {
            tags.push(getTag('location.municipality', rawValue.municipality, this.removeTagCallback('municipality')));
        }

        this.tags = tags;
    }

    removeTagCallback(formField: string) {
        return () => {
            this.filterForm.get(formField).reset();
            this.filter();
        };
    }

    getWatercourses(val: any) {
        this.locationsService.searchWatercourses(val).pipe(
            take(1),
            map(watercourses => {
                return watercourses.map(watercourse => ({
                    selectValue: watercourse.name,
                    option: watercourse,
                }));
            }),
        ).subscribe(value => this.watercourses = value as any as SearchableSelectOption[]);
    }

    getLenticWaterbodies(val: any) {
        this.locationsService.searchLenticWaterbodyNames(val).pipe(
            take(1),
            map(lenticWaterBodies => {
                return lenticWaterBodies.map(lenticWaterbody => ({
                    selectValue: lenticWaterbody.name,
                    option: lenticWaterbody,
                }));
            }),
        ).subscribe(value => this.lenticWaterbodies = value as any as SearchableSelectOption[]);
    }

    getProvinces(val: any) {
        this.locationsService.searchProvinces(val).pipe(
            take(1),
            map(provinces => {
                return provinces.map(province => ({
                    selectValue: province.name,
                    option: province,
                }));
            }),
        ).subscribe(value => this.provinces = value as any as SearchableSelectOption[]);
    }

    getMunicipalities(val: any) {
        this.locationsService.searchMunicipalities(val).pipe(
            take(1),
            map(municipalities => {
                return municipalities.map(municipality => ({
                    selectValue: municipality.name,
                    option: municipality,
                }));
            }),
        ).subscribe(value => this.municipalities = value as any as SearchableSelectOption[]);
    }

    getBasins(val: any) {
        this.locationsService.searchBasins(val).pipe(
            take(1),
            map(basins => {
                return basins.map(basin => ({
                    selectValue: basin.name,
                    option: basin,
                }));
            }),
        ).subscribe(value => this.basins = value as any as SearchableSelectOption[]);
    }

    getFishingPointCodes(val: any) {
        this.locationsService.searchFishingPointCodes(val).pipe(
            take(1),
            map(fishingPointCodes => {
                return fishingPointCodes.map(fishingPointCode => ({
                    selectValue: fishingPointCode.name,
                    option: fishingPointCode,
                }));
            }),
        ).subscribe(value => this.fishingPointCodes = value as any as SearchableSelectOption[]);
    }

    export() {
        this.locationsService.exportLocations(this.locationCodesToExport, this.filenameInput.nativeElement.value)
            .pipe(take(1))
            .subscribe(res => {
                this.locationsService.downloadFile(res);
            });
    }

    isMarkedForExport(fishingPoint: FishingPoint) {
        return this.locationCodesToExport.indexOf(fishingPoint.code) >= 0;
    }

    toggleToExport(fishingPoint: FishingPoint) {
        const index = this.locationCodesToExport.indexOf(fishingPoint.code);
        if (index >= 0) {
            this.locationCodesToExport.splice(index, 1);
        } else {
            this.locationCodesToExport.push(fishingPoint.code);
        }
    }

    removeLocationCodeToExport(locationCode: string) {
        const index = this.locationCodesToExport.indexOf(locationCode);
        this.locationCodesToExport.splice(index, 1);
    }

    toggleExportMode() {
        this.exportMode = !this.exportMode;
    }

    toggleAllToExport() {
        const isAllChecked = this.checkboxAll.nativeElement.checked;

        this.checkboxes.forEach(item => {
                if (isAllChecked && !item.nativeElement.checked) {
                    item.nativeElement.click();
                } else if (!isAllChecked && item.nativeElement.checked) {
                    item.nativeElement.click();
                }
            },
        );
    }

    isAllMarkedForExport() {
        let result = false;
        this.checkboxes.forEach(item => result = result || item.nativeElement.checked);
        return result;
    }
}

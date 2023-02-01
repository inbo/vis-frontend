import {Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {Title} from '@angular/platform-browser';
import {BreadcrumbLink} from '../../../shared-ui/breadcrumb/BreadcrumbLinks';
import {AsyncPage} from '../../../shared-ui/paging-async/asyncPage';
import {Subscription} from 'rxjs';
import {FishingPoint} from '../../../domain/fishing-point/fishing-point';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FishingPointsService} from '../../../services/vis.fishing-points.service';
import {FishingPointsMapComponent} from '../../components/fishing-points-map/fishing-points-map.component';
import {LatLng} from 'leaflet';
import {Role} from '../../../core/_models/role';
import {getTag, Tag} from '../../../shared-ui/slide-over-filter/tag';
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {take} from 'rxjs/operators';
import {SearchableSelectOption} from '../../../shared-ui/searchable-select/SearchableSelectOption';
import {SearchableSelectConfig, SearchableSelectConfigBuilder} from '../../../shared-ui/searchable-select/SearchableSelectConfig';

@Component({
    selector: 'app-fishing-point-overview-page',
    templateUrl: './fishing-point-overview-page.component.html',
    styleUrls: ['./fishing-point-overview-page.component.scss'],
})
export class FishingPointOverviewPageComponent implements OnInit, OnDestroy {

    links: NavigationLink[] = GlobalConstants.links;
    breadcrumbLinks: BreadcrumbLink[] = [
        {title: 'Vispunten', url: '/vispunten'},
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
    filterForm: UntypedFormGroup;

    highlightedLocation: number;
    fishingPointCodesToExport: string[] = [];
    exportMode = false;

    watercourses: SearchableSelectOption<string>[] = [];
    lenticWaterbodies: SearchableSelectOption<string>[] = [];
    municipalities: SearchableSelectOption<string>[] = [];
    basins: SearchableSelectOption<string>[] = [];
    fishingPointCodes: SearchableSelectOption<string>[] = [];
    provinces: SearchableSelectOption<string>[] = [];

    fishingPointSearchableSelectConfig: SearchableSelectConfig;
    mapHeight = this.calculateMapHeight();
    private subscription = new Subscription();

    constructor(private titleService: Title,
                private fishingPointsService: FishingPointsService,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private formBuilder: UntypedFormBuilder) {
        this.titleService.setTitle('Locaties');

        this.fishingPointSearchableSelectConfig = new SearchableSelectConfigBuilder()
            .minQueryLength(2)
            .searchPlaceholder('Minstens 2 karakters...')
            .build();
    }

    @HostListener('window:resize')
    onResize() {
        this.mapHeight = this.calculateMapHeight();
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

        this.subscription.add(
            this.activatedRoute.queryParams
                .subscribe((params) => {
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
                        this.map.updateFishingPointsLayer(this.filterForm.getRawValue()).subscribe();
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

        this.fishingPointsService
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

    removeTagCallback(formField: string) {
        return () => {
            this.filterForm.get(formField).reset();
            this.filter();
        };
    }

    getWatercourses(searchQuery: string) {
        this.fishingPointsService
            .searchWatercourses(searchQuery)
            .pipe(take(1))
            .subscribe(watercourses =>
                this.watercourses = watercourses
                    .map(watercourse => ({
                        displayValue: watercourse.name,
                        value: watercourse.name,
                    })));
    }

    getLenticWaterbodies(searchQuery: string) {
        this.fishingPointsService
            .searchLenticWaterbodyNames(searchQuery)
            .pipe(take(1))
            .subscribe(lenticWaterBodies =>
                this.lenticWaterbodies = lenticWaterBodies
                    .map(lenticWaterbody => ({
                        displayValue: lenticWaterbody.name,
                        value: lenticWaterbody.name,
                    })));
    }

    getMunicipalities(searchQuery: string) {
        this.fishingPointsService
            .searchMunicipalities(searchQuery)
            .pipe(take(1))
            .subscribe(municipalities =>
                this.municipalities = municipalities.map(municipality => ({
                    displayValue: municipality.name,
                    value: municipality.name,
                })));
    }

    getBasins(val: any) {
        this.fishingPointsService
            .searchBasins(val)
            .pipe(take(1))
            .subscribe(basins =>
                this.basins = basins.map(basin => ({
                    displayValue: basin.name,
                    value: basin.name,
                })));
    }

    getFishingPointCodes(searchQuery: string) {
        this.fishingPointsService
            .searchFishingPointCodes(searchQuery)
            .pipe(take(1))
            .subscribe(fishingPointCodes =>
                this.fishingPointCodes = fishingPointCodes
                    .map(fishingPointCode => ({
                        displayValue: fishingPointCode.name,
                        value: fishingPointCode.name,
                    })));
    }

    getProvinces(searchQuery: string) {
        this.fishingPointsService
            .searchProvinces(searchQuery)
            .pipe(take(1))
            .subscribe(provinces => this.provinces = provinces
                .map(province => ({
                    displayValue: province.name,
                    value: province.name,
                })));
    }

    export() {
        this.fishingPointsService
            .exportFishingPoints(this.fishingPointCodesToExport, this.filenameInput.nativeElement.value)
            .pipe(take(1))
            .subscribe(res => {
                this.fishingPointsService.downloadFile(res);
            });
    }

    isMarkedForExport(fishingPoint: FishingPoint) {
        return this.fishingPointCodesToExport.indexOf(fishingPoint.code) >= 0;
    }

    toggleToExport(fishingPoint: FishingPoint) {
        const index = this.fishingPointCodesToExport.indexOf(fishingPoint.code);
        if (index >= 0) {
            this.fishingPointCodesToExport.splice(index, 1);
        } else {
            this.fishingPointCodesToExport.push(fishingPoint.code);
        }
    }

    removeLocationCodeToExport(fishingPointCode: string) {
        const index = this.fishingPointCodesToExport.indexOf(fishingPointCode);
        this.fishingPointCodesToExport.splice(index, 1);
    }

    toggleExportMode() {
        this.exportMode = !this.exportMode;
        if (!this.exportMode) {
            this.fishingPointCodesToExport = [];
        }
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

    resetExport() {
        this.fishingPointCodesToExport = [];
    }

    selectAllFilteredLocations() {
        this.fishingPointsService
            .getFishingPointCodes(this.filterForm.getRawValue())
            .pipe(take(1))
            .subscribe(
                codes => this.fishingPointCodesToExport = codes || [],
            );
    }

    private calculateMapHeight() {
        return Math.round((window.innerHeight - 157) * 0.8);
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
}

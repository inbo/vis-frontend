import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Observable, of, Subscription} from 'rxjs';
import {FishingPointsService} from '../../../services/vis.fishing-points.service';
import {ProjectFishingPoint} from '../../../domain/fishing-point/project-fishing-point';
import {AsyncPage} from '../../../shared-ui/paging-async/asyncPage';
import {LatLng} from 'leaflet';
import {FishingPointsMapComponent} from '../../components/fishing-points-map/fishing-points-map.component';
import {getTag, Tag} from '../../../shared-ui/slide-over-filter/tag';
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {take} from 'rxjs/operators';
import {SearchableSelectOption} from '../../../shared-ui/searchable-select/SearchableSelectOption';
import {SearchableSelectConfig, SearchableSelectConfigBuilder} from '../../../shared-ui/searchable-select/SearchableSelectConfig';

@Component({
    selector: 'app-project-fishing-point-page',
    templateUrl: './project-fishing-points-page.component.html',
    styleUrls: ['./project-fishing-points-page.component.scss'],
})
export class ProjectFishingPointsPageComponent implements OnInit, OnDestroy {
    @ViewChild(FishingPointsMapComponent) map: FishingPointsMapComponent;
    @ViewChild(FishingPointsMapComponent, {read: ElementRef}) mapElement: ElementRef;

    loading = false;
    pager: AsyncPage<ProjectFishingPoint>;
    fishingPoints$: Observable<ProjectFishingPoint[]>;

    private subscription = new Subscription();
    projectCode: string;

    tags: Tag[] = [];
    filterForm: UntypedFormGroup;

    highlightedLocation: number;

    watercourses: SearchableSelectOption<string>[] = [];
    lenticWaterbodies: SearchableSelectOption<string>[] = [];
    provinces: SearchableSelectOption<string>[] = [];
    municipalities: SearchableSelectOption<string>[] = [];
    basins: SearchableSelectOption<string>[] = [];
    fishingPointCodes: SearchableSelectOption<string>[] = [];
    fishingPointSearchableSelectConfig: SearchableSelectConfig;

    constructor(private titleService: Title, private activatedRoute: ActivatedRoute, private fishingPointsService: FishingPointsService,
                private router: Router, private formBuilder: UntypedFormBuilder) {
        this.projectCode = this.activatedRoute.parent.snapshot.params.projectCode;
        this.titleService.setTitle('Project ' + this.projectCode + ' vispunten');

        this.fishingPointSearchableSelectConfig = new SearchableSelectConfigBuilder()
            .minQueryLength(2)
            .searchPlaceholder('Minstens 2 karakters...')
            .build();
    }

    ngOnInit(): void {
        const queryParams = this.activatedRoute.snapshot.queryParams;
        this.filterForm = this.formBuilder.group(
            {
                fishingPointCode: [queryParams.fishingPointCode ?? null],
                description: [queryParams.description ?? null],
                watercourse: [queryParams.watercourse ?? null],
                lenticWaterbody: [queryParams.lenticWaterbody ?? null],
                basin: [queryParams.basin ?? null],
                province: [queryParams.province ?? null],
                municipality: [queryParams.municipality ?? null],
                page: [queryParams.page ?? null],
                size: [queryParams.size ?? null],
            },
        );

        this.subscription.add(this.activatedRoute.queryParams.subscribe((params) => {
            this.filterForm.get('fishingPointCode').patchValue(params.fishingPointCode ? params.fishingPointCode : null);
            this.filterForm.get('description').patchValue(params.description ? params.description : null);
            this.filterForm.get('watercourse').patchValue(params.watercourse ? params.watercourse : null);
            this.filterForm.get('lenticWaterbody').patchValue(params.lenticWaterbody ? params.lenticWaterbody : null);
            this.filterForm.get('basin').patchValue(params.basin ? params.basin : null);
            this.filterForm.get('province').patchValue(params.province ? params.province : null);
            this.filterForm.get('municipality').patchValue(params.municipality ? params.municipality : null);
            this.filterForm.get('page').patchValue(params.page ? params.page : null);
            this.filterForm.get('size').patchValue(params.size ? params.size : null);

            this.getWatercourses(queryParams.watercourse ? queryParams.watercourse : null);
            this.getLenticWaterbodies(queryParams.lenticWaterbody ? queryParams.lenticWaterbody : null);
            this.getProvinces(queryParams.province ? queryParams.province : null);
            this.getMunicipalities(queryParams.municipality ? queryParams.municipality : null);
            this.getBasins(queryParams.basin ? queryParams.basin : null);
            this.getFishingPointCodes(queryParams.fishingPointCode ? queryParams.fishingPointCode : null);

            this.getFishingPoints();
        }));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    zoomToLocation(fishingPoint: ProjectFishingPoint) {
        this.highlightedLocation = fishingPoint.id;

        const latlng = new LatLng(fishingPoint.lat, fishingPoint.lng);
        this.map.zoomTo(latlng);
        this.mapElement.nativeElement.scrollIntoView();
    }

    getFishingPoints() {
        this.setTags();

        this.loading = true;
        this.fishingPoints$ = of([]);

        const filter = this.filterForm?.getRawValue();
        const page = this.filterForm.get('page').value ?? 0;
        const size = this.filterForm.get('size').value ?? 20;

        this.subscription.add(
            this.fishingPointsService.findByProjectCode(this.projectCode, page, size, filter).subscribe((value) => {
                this.pager = value;
                this.fishingPoints$ = of(value.content);
                this.loading = false;
            }),
        );
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
        this.filter();
    }

    private setTags() {
        const rawValue = this.filterForm.getRawValue();
        const tags: Tag[] = [];

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
        this.fishingPointsService
            .searchWatercourses(val)
            .pipe(take(1))
            .subscribe(watercourses =>
                this.watercourses = watercourses.map(watercourse => ({
                    displayValue: watercourse.name,
                    value: watercourse.name,
                })));
    }

    getLenticWaterbodies(val: any) {
        this.fishingPointsService
            .searchLenticWaterbodyNames(val)
            .pipe(take(1))
            .subscribe(lenticWaterBodies => this.lenticWaterbodies = lenticWaterBodies
                .map(lenticWaterbody => ({
                    displayValue: lenticWaterbody.name,
                    value: lenticWaterbody.name,
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

    getMunicipalities(val: any) {
        this.fishingPointsService
            .searchMunicipalities(val)
            .pipe(take(1))
            .subscribe(municipalities => this.municipalities = municipalities
                .map(municipality => ({
                    displayValue: municipality.name,
                    value: municipality.name,
                })));
    }

    getBasins(val: any) {
        this.fishingPointsService
            .searchBasins(val)
            .pipe(take(1))
            .subscribe(basins => this.basins = basins.map(basin => ({
                displayValue: basin.name,
                value: basin.name,
            })));
    }

    getFishingPointCodes(val: any) {
        this.fishingPointsService
            .searchFishingPointCodes(val)
            .pipe(take(1))
            .subscribe(fishingPointCodes =>
                this.fishingPointCodes = fishingPointCodes.map(fishingPointCode => ({
                    displayValue: fishingPointCode.name,
                    value: fishingPointCode.name,
                })));
    }
}

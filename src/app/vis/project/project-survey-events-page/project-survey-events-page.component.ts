import {Component, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Observable, of, Subscription} from 'rxjs';
import {AsyncPage} from '../../../shared-ui/paging-async/asyncPage';
import {SurveyEventOverview} from '../../../domain/survey-event/surveyEvent';
import {SurveyEventsService} from '../../../services/vis.surveyevents.service';
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {map, take} from 'rxjs/operators';
import {SearchableSelectOption} from '../../../shared-ui/searchable-select/SearchableSelectOption';
import {MethodsService} from '../../../services/vis.methods.service';
import {TaxaService} from '../../../services/vis.taxa.service';
import {getTag, Tag} from '../../../shared-ui/slide-over-filter/tag';
import {DatePipe} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
import {Method} from '../../../domain/method/method';
import {MethodGroup} from '../../../domain/method/method-group';
import {MultiSelectOption} from '../../../shared-ui/multi-select/multi-select';
import {Role} from '../../../core/_models/role';
import {AuthService} from '../../../core/auth.service';
import {FishingPointsService} from '../../../services/vis.fishing-points.service';
import {Watercourse} from '../../../domain/fishing-point/watercourse';
import {Basin} from '../../../domain/fishing-point/basin';
import {Municipality} from '../../../domain/fishing-point/municipality';
import {SearchableSelectConfig, SearchableSelectConfigBuilder} from '../../../shared-ui/searchable-select/SearchableSelectConfig';

@Component({
    selector: 'vis-project-survey-events-page',
    templateUrl: './project-survey-events-page.component.html',
})
export class ProjectSurveyEventsPageComponent implements OnInit, OnDestroy {

    role = Role;

    loading = false;
    pager: AsyncPage<SurveyEventOverview>;
    tags: Tag[] = [];
    methods: Method[];
    projectCode: string;

    surveyEvents$: Observable<SurveyEventOverview[]>;
    methodGroups$: Observable<MethodGroup[]>;
    methods$: Observable<Method[]>;
    statuses$: Observable<MultiSelectOption[]>;
    watercourses$: Observable<Watercourse[]>;
    basins$: Observable<Basin[]>;
    municipalities$: Observable<Municipality[]>;

    species: SearchableSelectOption<number>[] = [];
    watercourses: SearchableSelectOption<string>[] = [];
    lenticWaterbodies: SearchableSelectOption<string>[] = [];
    municipalities: SearchableSelectOption<string>[] = [];
    basins: SearchableSelectOption<string>[] = [];
    fishingPointCodes: SearchableSelectOption<string>[] = [];

    fishingPointSearchableSelectConfig: SearchableSelectConfig;

    filterForm: UntypedFormGroup;

    private subscription = new Subscription();

    constructor(private titleService: Title, private surveyEventsService: SurveyEventsService, private methodsService: MethodsService,
                private activatedRoute: ActivatedRoute, private router: Router, private formBuilder: UntypedFormBuilder,
                private taxaService: TaxaService, private datePipe: DatePipe, private translateService: TranslateService,
                public authService: AuthService, private fishingPointsService: FishingPointsService) {
        this.fishingPointSearchableSelectConfig = new SearchableSelectConfigBuilder()
            .minQueryLength(2)
            .searchPlaceholder('Minstens 2 karakters...')
            .build();
    }

    ngOnInit(): void {
        this.titleService.setTitle(`Waarnemingen voor ${this.activatedRoute.parent.snapshot.params.projectCode}`);
        this.projectCode = this.activatedRoute.parent.snapshot.params.projectCode;

        this.statuses$ = this.surveyEventsService.listStatusCodes().pipe(map(values => values.map(value => {
            return {value, displayValue: this.translateService.instant('surveyEvent.status.' + value)};
        })));

        const queryParams = this.activatedRoute.snapshot.queryParams;
        this.filterForm = this.formBuilder.group(
            {
                watercourse: [queryParams.watercourse ?? null],
                lenticWaterbody: [queryParams.lenticWaterbody ?? null],
                municipality: [queryParams.municipality ?? null],
                basin: [queryParams.basin ?? null],
                period: [queryParams.period ?? null],
                sort: [queryParams.sort ?? null],
                measuringPointNumber: [queryParams.measuringPointNumber ?? null],
                methodGroup: [queryParams.methodGroup ?? null],
                method: [queryParams.method ?? null],
                species: [queryParams.species ? Number(queryParams.species) : null],
                status: [queryParams.status != null ? (Array.isArray(queryParams.status) ? queryParams.status : [queryParams.status]) : ['ENTERED', 'VALID']],
                page: [queryParams.page ?? null],
                size: [queryParams.size ?? null],
            },
        );

        this.getWatercourses(queryParams.watercourse ? queryParams.watercourse : null);
        this.getLenticWaterbodies(queryParams.lenticWaterbody ? queryParams.lenticWaterbody : null);
        this.getMunicipalities(queryParams.municipality ? queryParams.municipality : null);
        this.getBasins(queryParams.basin ? queryParams.basin : null);
        this.getFishingPointCodes(queryParams.measuringPointNumber ? queryParams.measuringPointNumber : null);
        this.getSpecies(null, queryParams.species ? queryParams.species : undefined);

        this.methodGroups$ = this.methodsService.getAllMethodGroups();
        this.watercourses$ = this.fishingPointsService.searchWatercourses();
        this.basins$ = this.fishingPointsService.searchBasins();
        this.municipalities$ = this.fishingPointsService.searchMunicipalities();

        this.subscription.add(
            this.filterForm.get('methodGroup').valueChanges.subscribe(value => {
                if (value) {
                    this.methods$ = this.methodsService.getMethodsForGroup(value);
                } else {
                    this.methods$ = this.methodsService.getAllMethods();
                }
            }),
        );

        this.subscription.add(this.activatedRoute.queryParams.subscribe((params) => {
            const period = params.period && (params.period[0] && params.period[1]) ?
                [new Date(params.period[0]), new Date(params.period[1])] : null;

            this.filterForm.get('watercourse').patchValue(params.watercourse ? params.watercourse : null);
            this.filterForm.get('lenticWaterbody').patchValue(params.lenticWaterbody ? params.lenticWaterbody : null);
            this.filterForm.get('municipality').patchValue(params.municipality ? params.municipality : null);
            this.filterForm.get('basin').patchValue(params.basin ? params.basin : null);
            this.filterForm.get('period').patchValue(period);
            this.filterForm.get('sort').patchValue(params.sort ? params.sort : null);
            this.filterForm.get('measuringPointNumber').patchValue(params.measuringPointNumber ? params.measuringPointNumber : null);
            this.filterForm.get('status').patchValue(params.status ?
                (Array.isArray(params.status) ? params.status : [params.status]) : ['ENTERED', 'VALID']);
            this.filterForm.get('page').patchValue(params.page ? params.page : null);
            this.filterForm.get('size').patchValue(params.size ? params.size : null);
            this.filterForm.get('methodGroup').patchValue(params.methodGroup ? params.methodGroup : null);
            this.filterForm.get('method').patchValue(params.method ? params.method : null);
            this.filterForm.get('species').patchValue(params.species ? Number(params.species) : null);

            this.getSpecies(null, params.species ? params.species : undefined);
            this.getSurveyEvents();
        }));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    getSurveyEvents() {
        this.setTags();

        this.loading = true;
        this.surveyEvents$ = of([]);

        const filter = this.filterForm?.getRawValue();
        if (filter && filter.period?.length === 2) {
            filter.begin = new Date(filter.period[0]).toISOString();
            filter.end = new Date(filter.period[1]).toISOString();
            delete filter.period;
        }

        if (filter && filter.species) {
            filter.taxonId = filter.species;
        }

        const page = this.filterForm.get('page').value ?? 0;
        const size = this.filterForm.get('size').value ?? 20;

        this.subscription.add(
            this.surveyEventsService.getSurveyEvents(this.activatedRoute.parent.snapshot.params.projectCode, page, size, filter)
                .subscribe((value) => {
                    this.pager = value;
                    this.surveyEvents$ = of(value.content);
                    this.loading = false;
                }),
        );
    }

    getSpecies(val: string, id?: number) {
        this.taxaService.getTaxa(val, id)
            .pipe(take(1))
            .subscribe(taxa =>
                this.species = taxa
                    .map(taxon => ({
                        displayValue: `${taxon.nameDutch}`,
                        value: taxon.id.value,
                    })));
    }


    filter() {
        if (this.filterForm.get('period').value?.length < 2) {
            return;
        }

        const rawValue = this.filterForm.getRawValue();
        if (rawValue && rawValue.species) {
            rawValue.taxonId = rawValue.species;
        }

        const queryParams: Params = {...rawValue};
        queryParams.page = 1;

        this.router.navigate(
            [],
            {
                relativeTo: this.activatedRoute,
                queryParams,
            });
    }

    private setTags() {
        const rawValue = this.filterForm.getRawValue();
        const tags: Tag[] = [];

        if (rawValue.watercourse) {
            tags.push(getTag('surveyEvent.watercourse', rawValue.watercourse, this.removeTagCallback('watercourse')));
        }
        if (rawValue.lenticWaterbody) {
            tags.push(getTag('surveyEvent.lenticWaterbody', rawValue.lenticWaterbody, this.removeTagCallback('lenticWaterbody')));
        }
        if (rawValue.municipality) {
            tags.push(getTag('surveyEvent.municipality', rawValue.municipality, this.removeTagCallback('municipality')));
        }
        if (rawValue.basin) {
            tags.push(getTag('surveyEvent.basin', rawValue.basin, this.removeTagCallback('basin')));
        }
        if (rawValue.period && rawValue.period.length === 2) {
            const period = `${this.datePipe.transform(rawValue.period[0], 'dd/MM/yyyy')} - ${this.datePipe.transform(rawValue.period[1], 'dd/MM/yyyy')}`;
            tags.push(getTag('surveyEvent.period', period, this.removeTagCallback('period')));
        }
        if (rawValue.measuringPointNumber) {
            tags.push(getTag('surveyEvent.measuringPointNumber', rawValue.measuringPointNumber,
                this.removeTagCallback('measuringPointNumber')));
        }
        if (rawValue.methodGroup) {
            tags.push(getTag('surveyEvent.methodGroup', this.translateService.instant('method.group.' + rawValue.methodGroup),
                this.removeTagCallback('methodGroup')));
        }
        if (rawValue.method) {
            tags.push(getTag('surveyEvent.method', this.translateService.instant('method.' + rawValue.method),
                this.removeTagCallback('method')));
        }
        if (rawValue.species) {
            this.taxaService.getTaxon(Number(rawValue.species)).subscribe(value => {
                tags.push(getTag('surveyEvent.species', value.nameDutch, this.removeTagCallback('species')));
            });
        }
        if (rawValue.status) {
            const readableStatuses = this.filterForm.get('status').value
                .map(value => this.translateService.instant(`surveyEvent.status.${value}`)).join(', ');
            tags.push(getTag('surveyEvent.statusTitle', readableStatuses, this.removeTagCallback('status')));
        }

        this.tags = tags;
    }

    removeTagCallback(formField: string) {
        return () => {
            this.filterForm.get(formField).reset();
            this.filter();
        };
    }

    reset() {
        this.filter();
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
}

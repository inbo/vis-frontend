import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Observable, of, Subscription} from 'rxjs';
import {LocationsService} from '../../../services/vis.locations.service';
import {ProjectFishingPoint} from '../../../domain/location/project-fishing-point';
import {AsyncPage} from '../../../shared-ui/paging-async/asyncPage';
import {LatLng} from 'leaflet';
import {FishingPointsMapComponent} from '../../components/fishing-points-map/fishing-points-map.component';
import {getTag, Tag} from '../../../shared-ui/slide-over-filter/tag';
import {FormBuilder, FormGroup} from '@angular/forms';
import {map, take} from 'rxjs/operators';
import {SearchableSelectOption} from '../../../shared-ui/searchable-select/option';

@Component({
  selector: 'app-project-locations-page',
  templateUrl: './project-locations-page.component.html'
})
export class ProjectLocationsPageComponent implements OnInit, OnDestroy {
  @ViewChild(FishingPointsMapComponent) map: FishingPointsMapComponent;
  @ViewChild(FishingPointsMapComponent, {read: ElementRef}) mapElement: ElementRef;

  loading = false;
  pager: AsyncPage<ProjectFishingPoint>;
  fishingPoints$: Observable<ProjectFishingPoint[]>;

  private subscription = new Subscription();
  projectCode: string;

  tags: Tag[] = [];
  filterForm: FormGroup;

  highlightedLocation: number;

  watercourses: SearchableSelectOption[] = [];
  lenticWaterbodies: SearchableSelectOption[] = [];
  provinces: SearchableSelectOption[] = [];
  municipalities: SearchableSelectOption[] = [];
  basins: SearchableSelectOption[] = [];
  fishingPointCodes: SearchableSelectOption[] = [];

  constructor(private titleService: Title, private activatedRoute: ActivatedRoute, private locationsService: LocationsService,
              private router: Router, private formBuilder: FormBuilder) {
    this.projectCode = this.activatedRoute.parent.snapshot.params.projectCode;
    this.titleService.setTitle('Project ' + this.projectCode + ' locaties');
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
        size: [queryParams.size ?? null]
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
      this.locationsService.findByProjectCode(this.projectCode, page, size, filter).subscribe((value) => {
        this.pager = value;
        this.fishingPoints$ = of(value.content);
        this.loading = false;
      })
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
        queryParams
      }).then();
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
    this.locationsService.searchWatercourses(val).pipe(
      take(1),
      map(watercourses => {
        return watercourses.map(watercourse => ({
          selectValue: watercourse.name,
          option: watercourse
        }));
      })
    ).subscribe(value => this.watercourses = value as any as SearchableSelectOption[]);
  }

  getLenticWaterbodies(val: any) {
    this.locationsService.searchLenticWaterbodyNames(val).pipe(
      take(1),
      map(lenticWaterBodies => {
        return lenticWaterBodies.map(lenticWaterbody => ({
          selectValue: lenticWaterbody.name,
          option: lenticWaterbody
        }));
      })
    ).subscribe(value => this.lenticWaterbodies = value as any as SearchableSelectOption[]);
  }

  getProvinces(val: any) {
    this.locationsService.searchProvinces(val).pipe(
      take(1),
      map(provinces => {
        return provinces.map(province => ({
          selectValue: province.name,
          option: province
        }));
      })
    ).subscribe(value => this.provinces = value as any as SearchableSelectOption[]);
  }

  getMunicipalities(val: any) {
    this.locationsService.searchMunicipalities(val).pipe(
      take(1),
      map(municipalities => {
        return municipalities.map(municipality => ({
          selectValue: municipality.name,
          option: municipality
        }));
      })
    ).subscribe(value => this.municipalities = value as any as SearchableSelectOption[]);
  }

  getBasins(val: any) {
    this.locationsService.searchBasins(val).pipe(
      take(1),
      map(basins => {
        return basins.map(basin => ({
          selectValue: basin.name,
          option: basin
        }));
      })
    ).subscribe(value => this.basins = value as any as SearchableSelectOption[]);
  }

  getFishingPointCodes(val: any) {
    this.locationsService.searchFishingPointCodes(val).pipe(
      take(1),
      map(fishingPointCodes => {
        return fishingPointCodes.map(fishingPointCode => ({
          selectValue: fishingPointCode.name,
          option: fishingPointCode
        }));
      })
    ).subscribe(value => this.fishingPointCodes = value as any as SearchableSelectOption[]);
  }
}

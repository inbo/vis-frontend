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
        page: [queryParams.page ?? null],
        size: [queryParams.size ?? null]
      },
    );

    this.subscription.add(this.activatedRoute.queryParams.subscribe((params) => {
      this.filterForm.get('fishingPointCode').patchValue(params.fishingPointCode ? params.fishingPointCode : null);
      this.filterForm.get('description').patchValue(params.description ? params.description : null);
      this.filterForm.get('page').patchValue(params.page ? params.page : null);
      this.filterForm.get('size').patchValue(params.size ? params.size : null);

      this.getFishingPoints();
    }));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  zoomToLocation(fishingPoint: ProjectFishingPoint) {
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

    this.tags = tags;
  }

  removeTagCallback(formField: string) {
    return () => {
      this.filterForm.get(formField).reset();
      this.filter();
    };
  }
}

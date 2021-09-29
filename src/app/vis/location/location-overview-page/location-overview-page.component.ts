import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {Title} from '@angular/platform-browser';
import {BreadcrumbLink} from '../../../shared-ui/breadcrumb/BreadcrumbLinks';
import {AsyncPage} from '../../../shared-ui/paging-async/asyncPage';
import {Observable, of, Subscription} from 'rxjs';
import {FishingPoint} from '../../../domain/location/fishing-point';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {LocationsService} from '../../../services/vis.locations.service';
import {FishingPointsMapComponent} from '../../components/fishing-points-map/fishing-points-map.component';
import {LatLng} from 'leaflet';
import {Role} from '../../../core/_models/role';
import {getTag, Tag} from '../../../shared-ui/slide-over-filter/tag';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-location-overview-page',
  templateUrl: './location-overview-page.component.html'
})
export class LocationOverviewPageComponent implements OnInit, OnDestroy {
  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Locaties', url: '/locaties'},
  ];

  @ViewChild(FishingPointsMapComponent) map: FishingPointsMapComponent;
  @ViewChild(FishingPointsMapComponent, {read: ElementRef}) mapElement: ElementRef;

  private subscription = new Subscription();

  loading = false;
  pager: AsyncPage<FishingPoint>;
  fishingPoints$: Observable<FishingPoint[]>;
  role = Role;

  tags: Tag[] = [];
  filterForm: FormGroup;

  constructor(private titleService: Title, private locationsService: LocationsService, private activatedRoute: ActivatedRoute,
              private router: Router, private formBuilder: FormBuilder) {
    this.titleService.setTitle('Locaties');
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

  zoomToLocation(fishingPoint: FishingPoint) {
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
      this.locationsService.getFishingPoints(page, size, filter).subscribe((value) => {
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

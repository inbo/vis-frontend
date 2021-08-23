import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {Title} from '@angular/platform-browser';
import {BreadcrumbLink} from '../../../shared-ui/breadcrumb/BreadcrumbLinks';
import {AsyncPage} from '../../../shared-ui/paging-async/asyncPage';
import {Observable, of, Subscription} from 'rxjs';
import {FishingPoint} from '../../../domain/location/fishing-point';
import {ActivatedRoute} from '@angular/router';
import {LocationsService} from '../../../services/vis.locations.service';
import {FishingPointsMapComponent} from '../../components/fishing-points-map/fishing-points-map.component';
import {LatLng} from 'leaflet';
import {Role} from '../../../core/_models/role';

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
  fishingPoints: Observable<FishingPoint[]>;
  role = Role;


  constructor(private titleService: Title, private locationsService: LocationsService, private activatedRoute: ActivatedRoute) {
    this.titleService.setTitle('Locaties');
  }

  ngOnInit(): void {
    this.subscription.add(
      this.activatedRoute.queryParams.subscribe((params) => {
        this.getFishingPoints(params.page ? params.page : 1, params.size ? params.size : 20);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  zoomToLocation(fishingPoint: FishingPoint) {
    const latlng = new LatLng(fishingPoint.lat, fishingPoint.lng);
    this.map.zoomTo(latlng);
    this.mapElement.nativeElement.scrollIntoView();
  }

  getFishingPoints(page: number, size: number) {
    this.loading = true;
    this.fishingPoints = of([]);
    this.subscription.add(
      this.locationsService.getFishingPoints(page, size).subscribe((value) => {
        this.pager = value;
        this.fishingPoints = of(value.content);
        this.loading = false;
      })
    );
  }
}

import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {Observable, of, Subscription} from 'rxjs';
import {LocationsService} from '../../../services/vis.locations.service';
import {ProjectFishingPoint} from '../../../domain/location/project-fishing-point';
import {AsyncPage} from '../../../shared-ui/paging-async/asyncPage';
import {LatLng} from 'leaflet';
import {FishingPointsMapComponent} from '../../components/fishing-points-map/fishing-points-map.component';

@Component({
  selector: 'app-project-locations-page',
  templateUrl: './project-locations-page.component.html'
})
export class ProjectLocationsPageComponent implements OnInit, OnDestroy {
  @ViewChild(FishingPointsMapComponent) map: FishingPointsMapComponent;
  @ViewChild(FishingPointsMapComponent, {read: ElementRef}) mapElement: ElementRef;

  loading = false;
  pager: AsyncPage<ProjectFishingPoint>;
  fishingPoints: Observable<ProjectFishingPoint[]>;

  private subscription = new Subscription();
  projectCode: string;

  constructor(private titleService: Title, private activatedRoute: ActivatedRoute, private locationsService: LocationsService) {
    this.projectCode = this.activatedRoute.parent.snapshot.params.projectCode;
    this.titleService.setTitle('Project ' + this.projectCode + ' locaties');
  }

  ngOnInit(): void {
    this.subscription.add(
      this.activatedRoute.queryParams.subscribe((params) => {
        this.getFishingPoints(params.page ? params.page : 1, params.size ? params.size : 20);
      })
    );
  }

  getFishingPoints(page: number, size: number) {
    this.loading = true;
    this.fishingPoints = of([]);
    this.subscription.add(
      this.locationsService.findByProjectCode(this.projectCode, page, size).subscribe((value) => {
        this.pager = value;
        this.fishingPoints = of(value.content);
        this.loading = false;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  zoomToLocation(fishingPoint: ProjectFishingPoint) {
    const latlng = new LatLng(fishingPoint.lat, fishingPoint.lng);
    this.map.zoomTo(latlng);
    this.mapElement.nativeElement.scrollIntoView();
  }
}

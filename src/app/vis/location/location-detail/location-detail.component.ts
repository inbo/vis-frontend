import {Component, OnInit, ViewChild} from '@angular/core';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {BreadcrumbLink} from '../../../shared-ui/breadcrumb/BreadcrumbLinks';
import {LocationsService} from '../../../services/vis.locations.service';
import {ActivatedRoute} from '@angular/router';
import {FishingPoint} from '../../../domain/location/fishing-point';
import {latLng} from 'leaflet';
import {FishingPointsMapComponent} from '../../components/fishing-points-map/fishing-points-map.component';

@Component({
  selector: 'app-location-detail',
  templateUrl: './location-detail.component.html'
})
export class LocationDetailComponent implements OnInit {
  @ViewChild(FishingPointsMapComponent, {static: true}) map: FishingPointsMapComponent;

  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Locaties', url: '/locaties'},
  ];

  fishingPoint: FishingPoint;

  constructor(private locationsService: LocationsService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    const code = this.activatedRoute.snapshot.params.code;

    this.locationsService.findByCode(code).subscribe(value => {
      this.fishingPoint = value;
      const latlng = latLng(this.fishingPoint.lat, this.fishingPoint.lng);
      this.map.setCenter(latlng);
    });


  }

}

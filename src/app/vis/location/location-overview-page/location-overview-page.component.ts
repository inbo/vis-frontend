import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {Title} from '@angular/platform-browser';
import {BreadcrumbLink} from '../../../shared-ui/breadcrumb/BreadcrumbLinks';
import {latLng, Layer, LayerGroup, layerGroup, Map as LeafletMap, MapOptions} from 'leaflet';
import {LeafletControlLayersConfig} from '@asymmetrik/ngx-leaflet/src/leaflet/layers/control/leaflet-control-layers-config.model';
import {basemapLayer, dynamicMapLayer, DynamicMapLayer, featureLayer, FeatureLayer, FeatureLayerService} from 'esri-leaflet';
import * as geojson from 'geojson';
import {AsyncPage} from '../../../shared-ui/paging-async/asyncPage';
import {Observable, of, Subscription} from 'rxjs';
import {FishingPoint} from '../../project/model/fishing-point';
import {ActivatedRoute} from '@angular/router';
import {LocationsService} from '../../../services/vis.locations.service';

@Component({
  selector: 'app-location-overview-page',
  templateUrl: './location-overview-page.component.html'
})
export class LocationOverviewPageComponent implements OnInit, OnDestroy {

  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Locaties', url: '/locaties'},
  ];

  private subscription = new Subscription();

  loading = false;
  pager: AsyncPage<FishingPoint>;
  fishingPoints: Observable<FishingPoint[]>;

  options: MapOptions;
  layersControl: LeafletControlLayersConfig;

  layers: Layer[];
  selected = {};

  service: FeatureLayerService;
  legend = new Map();

  private dml: DynamicMapLayer;

  features: geojson.Feature[] = [];
  private locationsLayer: FeatureLayer;
  private map: LeafletMap;

  private selectedLayer: LayerGroup;


  constructor(private titleService: Title, private locationsService: LocationsService, private activatedRoute: ActivatedRoute) {
    this.titleService.setTitle('Locaties');
  }

  ngOnInit(): void {
    this.setup();
    this.subscription.add(
      this.activatedRoute.queryParams.subscribe((params) => {
        this.getFishingPoints(params.page ? params.page : 1, params.size ? params.size : 20);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private setup() {
    this.service = new FeatureLayerService({url: 'https://gisservices.inbo.be'});

    this.dml = dynamicMapLayer(
      {
        url: 'https://inspirepub.waterinfo.be/arcgis/rest/services/VHA_waterlopen/MapServer',
        layers: [1, 2, 3, 4]
      }
    );

    this.dml.bindPopup((error, featureCollection) => {
      return featureCollection.features[0].properties.Naam;
    });

    this.selectedLayer = layerGroup();

    const basemapLayer1 = basemapLayer('Streets');
    this.layers = [
      basemapLayer1,
      this.dml,
      this.selectedLayer
    ];

    this.options = {
      zoom: 8,
      center: latLng(51.2, 4.14),
      doubleClickZoom: false
    };

    this.layersControl = {
      baseLayers: {
        'Open Street Map': basemapLayer1,
      },
      overlays: {
        'VHA Segmenten': this.dml,
      }
    };

    this.serverAuth((error, response) => {
      if (error) {
        return;
      }

      this.locationsLayer = featureLayer(
        {
          url: 'https://gisservices.inbo.be/arcgis/rest/services/Veld/VISpunten/FeatureServer/0',
          token: response.token
        }
      );

      this.layers.push(this.locationsLayer);
      this.layersControl.overlays.VISpunten = this.locationsLayer;

      this.locationsLayer.bindPopup(layer => {
        // @ts-ignore
        return layer.feature.properties.gebiedCode;
      });
    });
  }

  serverAuth(callback) {
    this.service.post('/portal/sharing/generateToken',
      {
        username: 'aquatbeheer',
        password: '002018#VIS',
        f: 'json',
        expiration: 86400,
        client: 'referer',
        referer: window.location.origin
      },
      callback);
  }


  getSelected() {
    return this.selected;
  }

  zoomToLocation(zoomToFeature: geojson.Feature) {
    console.log('todo');
  }

  mapReady(map: LeafletMap) {
    this.map = map;
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

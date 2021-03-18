import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {Title} from '@angular/platform-browser';
import {BreadcrumbLink} from '../../../shared-ui/breadcrumb/BreadcrumbLinks';
import {LatLng, latLng, Layer, MapOptions, Map as LeafletMap} from "leaflet";
import {LeafletControlLayersConfig} from "@asymmetrik/ngx-leaflet/src/leaflet/layers/control/leaflet-control-layers-config.model";
import {basemapLayer, featureLayer, FeatureLayer, FeatureLayerService} from "esri-leaflet";
import * as geojson from "geojson";

@Component({
  selector: 'app-location-overview-page',
  templateUrl: './location-overview-page.component.html'
})
export class LocationOverviewPageComponent implements OnInit {

  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Locaties', url: '/locaties'},
  ];

  options: MapOptions;
  layersControl: LeafletControlLayersConfig;

  layers: Layer[];
  selected = {};

  service: FeatureLayerService;
  legend = new Map()

  private fl1: FeatureLayer;
  private fl2: FeatureLayer;
  private fl3: FeatureLayer;
  features: geojson.Feature[] = [];
  private locationsLayer: FeatureLayer;
  private map: LeafletMap;

  constructor(private titleService: Title, private chRef: ChangeDetectorRef) {
    this.titleService.setTitle('Locaties');
  }

  ngOnInit(): void {
    this.setup();
  }

  private setup() {
    this.service = new FeatureLayerService({url: 'https://gisservices.inbo.be'});

    this.fl1 = featureLayer({url: 'https://inspirepub.waterinfo.be/arcgis/rest/services/VHA_waterlopen/MapServer/0'});
    this.fl2 = featureLayer({url: 'https://inspirepub.waterinfo.be/arcgis/rest/services/VHA_waterlopen/MapServer/1', ignoreRenderer: true});
    this.fl3 = featureLayer({url: 'https://inspirepub.waterinfo.be/arcgis/rest/services/VHA_waterlopen/MapServer/2'});

    this.fl1.metadata((error, metadata) => {
      let uniqueValueInfos = metadata.drawingInfo.renderer.uniqueValueInfos as [any];
      uniqueValueInfos.forEach(value => {
        this.legend.set(value.label, value.symbol.color.join(','));
      });
    });

    let basemapLayer1 = basemapLayer('Streets');
    this.layers = [
      basemapLayer1,
      this.fl1,
      this.fl2,
      this.fl3
    ]
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
        'Aslijnen Waterlopen ntzichtbaar': this.fl1,
        Wlas_20180601: this.fl2,
        Vhazone_20180601: this.fl3
      }
    }

    this.serverAuth((error, response) => {
      if (error) {
        return;
      }

      this.locationsLayer = featureLayer({url: 'https://gisservices.inbo.be/arcgis/rest/services/Veld/VISpunten/FeatureServer/0', token: response.token});

      this.layers.push(this.locationsLayer);
      this.layersControl.overlays.VISpunten = this.locationsLayer;
      this.locationsLayer.on('load', () => {
        this.locationsLayer.eachFeature((layer) => {
          layer.bindPopup(layer => layer.feature.properties.gebiedCode)
          this.features.push(layer.feature);
          this.chRef.detectChanges();
        });
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

  zoomToLocation(id: string | number) {
    const feature = this.locationsLayer.getFeature(id);
    this.locationsLayer.closePopup();
    feature.togglePopup();

    // feature..setStyle({
    //   color: 'green',
    // });

    // @ts-ignore
    this.map.setView(feature._latlng, 15)

  }

  mapReady($event: LeafletMap) {
    this.map = $event;
  }
}

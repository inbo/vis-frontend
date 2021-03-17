import { Component, OnInit } from '@angular/core';
import {basemapLayer, featureLayer, FeatureLayerService, FeatureLayer} from "esri-leaflet";
import {latLng, Layer, layerGroup, LayerGroup, LeafletMouseEvent, MapOptions, marker, } from "leaflet";
import {Title} from "@angular/platform-browser";
import {LeafletControlLayersConfig} from "@asymmetrik/ngx-leaflet/src/leaflet/layers/control/leaflet-control-layers-config.model";

@Component({
  selector: 'app-location-create-step1',
  templateUrl: './location-create-step1.component.html'
})
export class LocationCreateStep1Component implements OnInit {

  options: MapOptions;
  layersControl: LeafletControlLayersConfig;
  layers: Layer[];

  selected = {};
  selectedLayerUrl: string;

  service: FeatureLayerService;

  legend = new Map()
  private newLocationLayerGroup: LayerGroup;
  private selectedFeature: any;

  private fl1: FeatureLayer;
  private fl2: FeatureLayer;
  private fl3: FeatureLayer;

  constructor(private titleService: Title) {
    this.titleService.setTitle('Locatie toevoegen');
  }

  ngOnInit(): void {
    this.setup();
  }

  private setup() {
    this.service = new FeatureLayerService({url: 'https://gisservices.inbo.be'});

    this.fl1 = featureLayer({ url: 'https://inspirepub.waterinfo.be/arcgis/rest/services/VHA_waterlopen/MapServer/0' });
    this.fl2 = featureLayer({ url: 'https://inspirepub.waterinfo.be/arcgis/rest/services/VHA_waterlopen/MapServer/1', ignoreRenderer: true });
    this.fl3 = featureLayer({ url: 'https://inspirepub.waterinfo.be/arcgis/rest/services/VHA_waterlopen/MapServer/2' });

    this.selectStyle(this.fl1);
    this.selectStyle(this.fl2);
    this.selectStyle(this.fl3);

    this.newLocationLayerGroup = layerGroup()

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
      this.fl3,
      this.newLocationLayerGroup
    ]
    this.options = {
      zoom: 12,
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

    this.fl1.on('click', this.showFeatureInformation().bind(this));
    this.fl2.on('click', this.showFeatureInformation().bind(this));
    this.fl3.on('click', this.showFeatureInformation().bind(this));

    this.serverAuth((error, response) => {
      if (error) {
        return;
      }

      let locationsLayer = featureLayer({url: 'https://gisservices.inbo.be/arcgis/rest/services/Veld/VISpunten/FeatureServer/0', token: response.token});

      this.layers.push(locationsLayer);
      this.layersControl.overlays.VISpunten = locationsLayer;

      locationsLayer.on('click', this.showFeatureInformation().bind(this));

    });
  }

  private selectStyle(fl: FeatureLayer) {
    fl.on('click', (e) => {
      if (this.selectedFeature) {
        this.fl1.resetStyle();
        this.fl2.resetStyle();
        this.fl3.resetStyle();
      }
      this.selectedFeature = e.layer
      this.selectedFeature.setStyle({
        weight: 7,
      });
    });
  }

  serverAuth (callback) {
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

  private showFeatureInformation() {
    return function (e) {
      this.selectedLayerUrl = e.layer.options.url;
      this.selected = e.propagatedFrom.feature.properties;
    };
  }

  getSelected() {
    return this.selected;
  }

  addPoint(e: LeafletMouseEvent) {
    e.originalEvent.stopPropagation();
    let m = marker(e.latlng);
    this.newLocationLayerGroup.clearLayers();
    this.newLocationLayerGroup.addLayer(m);
  }
}

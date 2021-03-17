import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {basemapLayer, featureLayer, FeatureLayerService, FeatureLayer} from "esri-leaflet";
import {LatLng, latLng, Layer, layerGroup, LayerGroup, LeafletMouseEvent, MapOptions, marker,} from "leaflet";
import {Title} from "@angular/platform-browser";
import {LeafletControlLayersConfig} from "@asymmetrik/ngx-leaflet/src/leaflet/layers/control/leaflet-control-layers-config.model";

@Component({
  selector: 'app-location-create-step2',
  templateUrl: './location-create-step2.component.html'
})
export class LocationCreateStep2Component implements OnInit {

  @Input() formGroup;

  options: MapOptions;
  layersControl: LeafletControlLayersConfig;
  layers: Layer[];

  selected = {};

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
    console.log('init');
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
    this.newLocationLayerGroup.addLayer(marker(this.formGroup.get('coordinates').value));

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
      zoom: 17,
      center: this.formGroup.get('coordinates').value,
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

      let locationsLayer = featureLayer({url: 'https://gisservices.inbo.be/arcgis/rest/services/Veld/VISpunten/FeatureServer/0', token: response.token});

      this.layers.push(locationsLayer);
      this.layersControl.overlays.VISpunten = locationsLayer;

    });
  }

  private selectStyle(fl: FeatureLayer) {
    fl.on('click', (e) => {
      this.formGroup.get('waterway').patchValue(e.propagatedFrom.feature.properties);

      console.log(this.formGroup.get('waterway').value);

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


  getSelected() {
    return this.selected;
  }
}

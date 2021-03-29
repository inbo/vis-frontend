import {Component, Input, OnInit} from '@angular/core';
import {basemapLayer, DynamicMapLayer, dynamicMapLayer, featureLayer, FeatureLayer, FeatureLayerService} from 'esri-leaflet';
import L, {FeatureGroup, featureGroup, LatLng, latLng, Layer, layerGroup, LayerGroup, LeafletMouseEvent, Map as LeafletMap, MapOptions, marker} from 'leaflet';
import {Title} from '@angular/platform-browser';
import {LeafletControlLayersConfig} from '@asymmetrik/ngx-leaflet/src/leaflet/layers/control/leaflet-control-layers-config.model';
import {FormGroup} from '@angular/forms';
import {debounceTime} from 'rxjs/operators';
import * as geojson from 'geojson';

@Component({
  selector: 'app-location-create-step1',
  templateUrl: './location-create-step1.component.html'
})
export class LocationCreateStep1Component implements OnInit {

  @Input() formGroup: FormGroup;

  options: MapOptions;
  layersControl: LeafletControlLayersConfig;
  center: LatLng;

  layers: Layer[];
  selected = {};

  selectedLayerUrl: string;

  service: FeatureLayerService;
  legend = new Map();
  private newLocationLayerGroup: FeatureGroup;

  private map: LeafletMap;
  private selectedFeature: any;
  private dml: DynamicMapLayer;

  private selectedLayer: LayerGroup;

  constructor(private titleService: Title) {
    this.titleService.setTitle('Locatie toevoegen');
  }

  ngOnInit(): void {
    this.setup();
  }

  private setup() {
    this.service = new FeatureLayerService({url: 'https://gisservices.inbo.be'});

    this.dml = dynamicMapLayer(
      {
        url: 'https://inspirepub.waterinfo.be/arcgis/rest/services/VHA_waterlopen/MapServer', layers: [1, 2, 3, 4]
      }
    );

    this.newLocationLayerGroup = featureGroup();
    this.selectedLayer = layerGroup();

    // TODO get metadata from all layers?
    this.dml.metadata((error, metadata) => console.log(metadata));

    const basemapLayer1 = basemapLayer('Streets');
    this.layers = [
      basemapLayer1,
      this.dml,
      this.newLocationLayerGroup,
      this.selectedLayer
    ];
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
        Waterlopen: this.dml
      }
    };
    this.initLegend();


    this.serverAuth((error, response) => {
      if (error) {
        return;
      }

      const locationsLayer = featureLayer(
        {
          url: 'https://gisservices.inbo.be/arcgis/rest/services/Veld/VISpunten/FeatureServer/0',
          token: response.token
        }
      );

      this.layers.push(locationsLayer);
      this.layersControl.overlays.VISpunten = locationsLayer;

      locationsLayer.on('click', this.showFeatureInformation().bind(this));

    });

    this.formGroup.get('lat').valueChanges
      .pipe(
        debounceTime(300)
      )
      .subscribe(value => {
        if (this.formGroup.get('lat').invalid || this.formGroup.get('lng').invalid) {
          this.newLocationLayerGroup.clearLayers();
          return;
        }

        const latlng = latLng(value, this.formGroup.get('lng').value);
        const m = marker(latlng);
        this.newLocationLayerGroup.clearLayers();
        this.newLocationLayerGroup.addLayer(m);

        this.center = latlng;
      });

    this.formGroup.get('lng').valueChanges
      .pipe(
        debounceTime(300)
      )
      .subscribe(value => {
        if (this.formGroup.get('lat').invalid || this.formGroup.get('lng').invalid) {
          this.newLocationLayerGroup.clearLayers();
          return;
        }

        const latlng = latLng(this.formGroup.get('lat').value, value);
        const m = marker(latlng);
        this.newLocationLayerGroup.clearLayers();
        this.newLocationLayerGroup.addLayer(m);

        this.center = latlng;
      });
  }

  private initLegend() {
    const fl1 = featureLayer({url: 'https://inspirepub.waterinfo.be/arcgis/rest/services/VHA_waterlopen/MapServer/0'});
    const fl2 = featureLayer({url: 'https://inspirepub.waterinfo.be/arcgis/rest/services/VHA_waterlopen/MapServer/2'});
    const fl3 = featureLayer({url: 'https://inspirepub.waterinfo.be/arcgis/rest/services/VHA_waterlopen/MapServer/3'});
    const fl4 = featureLayer({url: 'https://inspirepub.waterinfo.be/arcgis/rest/services/VHA_waterlopen/MapServer/4'});

    fl1.metadata((error, metadata) => this.convertMetadataToLegend(metadata));

    fl2.metadata((error, metadata) => this.convertMetadataToLegend(metadata));

    fl3.metadata((error, metadata) => this.convertMetadataToLegend(metadata));

    fl4.metadata((error, metadata) => this.convertMetadataToLegend(metadata));
  }

  private convertMetadataToLegend(metadata) {
    const uniqueValueInfos = metadata.drawingInfo.renderer.uniqueValueInfos as [any];
    uniqueValueInfos.forEach(value => {
      this.legend.set(value.label, value.symbol.color.join(','));
    });
  }

  private selectStyle(fl: FeatureLayer) {
    fl.on('click', (e) => {
      if (this.selectedFeature) {
        fl.resetStyle();
      }
      this.selectedFeature = e.layer;
      this.selectedFeature.setStyle({
        weight: 7,
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

  private showFeatureInformation() {
    return function(e) {
      this.selectedLayerUrl = e.layer.options.url;
      this.selected = e.propagatedFrom.feature.properties;
    };
  }

  getSelected() {
    return this.selected;
  }

  addPoint(e: LeafletMouseEvent) {
    e.originalEvent.stopPropagation();
    const m = marker(e.latlng);
    this.newLocationLayerGroup.clearLayers();
    this.newLocationLayerGroup.addLayer(m);

    this.formGroup.get('lat').patchValue(e.latlng.lat, {emitEvent: false});
    this.formGroup.get('lng').patchValue(e.latlng.lng, {emitEvent: false});
  }

  coordinatesAreInvalid() {
    return (this.formGroup.get('lat').touched && this.formGroup.get('lat').invalid)
      || (this.formGroup.get('lng').touched && this.formGroup.get('lng').invalid);
  }

  clickMap(e: LeafletMouseEvent) {
    this.dml.identify().on(this.map).layers('all:1,2,3,4').at(e.latlng).run((error, featureCollection) => {
      if (error) {
        return;
      }

      this.selectedLayer.clearLayers();

      if (featureCollection.features.length > 0) {
        const feature = featureCollection.features[0] as geojson.Feature;
        this.selected = feature.properties;
        this.selectedLayer.addLayer(L.geoJSON(feature));
      }

    });
  }

  onReady(map: LeafletMap) {
    this.map = map;
  }
}

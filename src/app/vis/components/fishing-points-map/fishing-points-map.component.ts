import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from 'rxjs';
import * as L from 'leaflet';
import {featureGroup, icon, LatLng, latLng, Layer, layerGroup, LeafletMouseEvent, Map as LeafletMap, MapOptions, marker} from 'leaflet';
import {LeafletControlLayersConfig} from '@asymmetrik/ngx-leaflet/src/leaflet/layers/control/leaflet-control-layers-config.model';
import {basemapLayer, dynamicMapLayer, DynamicMapLayer, featureLayer, FeatureLayerService} from 'esri-leaflet';
import * as geojson from 'geojson';
import {LocationsService} from '../../../services/vis.locations.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-fishing-points-map',
  templateUrl: './fishing-points-map.component.html'
})
export class FishingPointsMapComponent implements OnInit, OnDestroy {

  @Input() zoomLevel = 8;
  @Input() canAddPoints = false;
  @Output() pointAdded = new EventEmitter<LatLng>();
  @Output() featureSelected = new EventEmitter<any>();

  private subscription = new Subscription();

  options: MapOptions = {
    maxZoom: 19,
    doubleClickZoom: false
  };

  layersControl: LeafletControlLayersConfig;

  layers: Layer[];

  service: FeatureLayerService;
  legend = new Map();

  newLocationLayerGroup = featureGroup();
  selectedLayer = layerGroup();

  private dml: DynamicMapLayer;

  features: geojson.Feature[] = [];
  locationsLayer: L.MarkerClusterGroup;
  markerClusterData = [];

  private map: LeafletMap;
  center: LatLng = latLng(51.2, 4.14);

  constructor(private locationsService: LocationsService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.setup();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private setup() {
    this.initLegend();
    this.locationsLayer = L.markerClusterGroup({removeOutsideVisibleBounds: true, spiderfyOnMaxZoom: false});

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

    const basemapLayer1 = basemapLayer('Topographic');
    this.layers = [
      basemapLayer1,
      this.dml,
      this.locationsLayer,
      this.newLocationLayerGroup,
      this.selectedLayer
    ];

    this.layersControl = {
      baseLayers: {
        'Open Street Map': basemapLayer1,
      },
      overlays: {
        'VHA Segmenten': this.dml,
        Vispunten: this.locationsLayer
      }
    };

    this.subscription.add(
      this.locationsService.getFishingPointsFeatures().subscribe(fishingPointFeatures => {
        fishingPointFeatures.forEach(fpf => {
          const latlng = latLng(fpf.x, fpf.y);
          const m = marker(latlng, {
            icon: icon({
              iconUrl: 'assets/images/marker.png'
            })
          });
          this.locationsLayer.addLayer(m);
        });
      })
    );

    console.log(this.zoomLevel);
  }

  mapReady(map: LeafletMap) {
    this.map = map;
  }

  zoomTo(latlng: LatLng) {
    this.map.setView(latlng, 15);
  }

  private initLegend() {
    const fl1 = featureLayer({url: 'https://inspirepub.waterinfo.be/arcgis/rest/services/VHA_waterlopen/MapServer/0'});
    const fl2 = featureLayer({url: 'https://inspirepub.waterinfo.be/arcgis/rest/services/VHA_waterlopen/MapServer/2'});
    const fl3 = featureLayer({url: 'https://inspirepub.waterinfo.be/arcgis/rest/services/VHA_waterlopen/MapServer/3'});
    const fl4 = featureLayer({url: 'https://inspirepub.waterinfo.be/arcgis/rest/services/VHA_waterlopen/MapServer/4'});

    fl1.metadata((error, metadata) => this.convertMetadataToLegend(metadata));

    // fl2.metadata((error, metadata) => this.convertMetadataToLegend(metadata));

    // fl3.metadata((error, metadata) => this.convertMetadataToLegend(metadata));
    //
    // fl4.metadata((error, metadata) => this.convertMetadataToLegend(metadata));
  }

  private convertMetadataToLegend(metadata) {
    const uniqueValueInfos = metadata.drawingInfo.renderer.uniqueValueInfos as [any];
    uniqueValueInfos.forEach(value => {
      this.legend.set(value.label, value.symbol.color.join(','));
    });
  }

  clearNewLocationMarker() {
    this.newLocationLayerGroup.clearLayers();
  }

  replaceNewLocationMarker(latlng: LatLng) {
    const m = marker(latlng);

    this.newLocationLayerGroup.clearLayers();
    this.newLocationLayerGroup.addLayer(m);

    this.center = latlng;
  }

  onDoubleClick(e: LeafletMouseEvent) {
    if (!this.canAddPoints) {
      return;
    }

    e.originalEvent.stopPropagation();
    const m = marker(e.latlng);
    this.newLocationLayerGroup.clearLayers();
    this.newLocationLayerGroup.addLayer(m);

    this.pointAdded.emit(e.latlng);

  }

  clickMap(e: LeafletMouseEvent) {
    this.dml.identify().on(this.map).layers('all:1,2,3,4').at(e.latlng).run((error, featureCollection) => {
      if (error) {
        return;
      }

      this.selectedLayer.clearLayers();

      if (featureCollection.features.length > 0) {
        const feature = featureCollection.features[0] as geojson.Feature;
        this.selectedLayer.addLayer(L.geoJSON(feature));
        this.featureSelected.emit(feature.properties);
      } else {
        this.featureSelected.emit({});
      }
    });
  }

  setCenter(latlng: LatLng) {
    this.options.center = latlng;
    this.center = latlng;
  }
}

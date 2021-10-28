import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from 'rxjs';
import * as L from 'leaflet';
import {circleMarker, CircleMarker, DragEndEvent, featureGroup, LatLng, latLng, Layer, layerGroup, LeafletEvent, LeafletMouseEvent, Map as LeafletMap, MapOptions, Marker, marker} from 'leaflet';
import {LeafletControlLayersConfig} from '@asymmetrik/ngx-leaflet/src/leaflet/layers/control/leaflet-control-layers-config.model';
import {basemapLayer, dynamicMapLayer, DynamicMapLayer, featureLayer} from 'esri-leaflet';
import * as geojson from 'geojson';
import {LocationsService} from '../../../services/vis.locations.service';
import {take} from 'rxjs/operators';
import {VhaUrl} from '../../../domain/location/vha-version';

@Component({
  selector: 'app-fishing-points-map',
  templateUrl: './fishing-points-map.component.html'
})
export class FishingPointsMapComponent implements OnInit, OnDestroy {

  @Input() heightClass = 'h-96';
  @Input() projectCode; // Get fishing points for a specific project, all fishing points are retrieved when null
  @Input() zoomLevel = 8; // Default zoom level
  @Input() canAddPoints = false; // To be able to add a single new point to the map
  @Input() fishingPointsLayerVisible = true;
  @Input() blueLayerVisible = true;
  @Input() watercoursesLayerVisible = true;
  @Input() townsLayerVisible = true;

  @Output() pointAdded = new EventEmitter<LatLng>();
  @Output() nearbyWatercoursesFound = new EventEmitter<any>();
  @Output() loaded = new EventEmitter<any>();
  @Output() blueLayerSelected = new EventEmitter<any>();
  @Output() vhaLayerSelected = new EventEmitter<any>();
  @Output() townLayerSelected = new EventEmitter<any>();

  private subscription = new Subscription();

  options: MapOptions = {
    maxZoom: 19,
    doubleClickZoom: false
  };

  layersControl: LeafletControlLayersConfig;

  legend = new Map();

  layers: Layer[];
  private orthoLayer: DynamicMapLayer;
  private watercourseLayer: DynamicMapLayer;
  private blueLayer: DynamicMapLayer;
  private townLayer: DynamicMapLayer;
  newLocationLayerGroup = featureGroup();

  highlightSelectionLayer = layerGroup();

  features: geojson.Feature[] = [];
  locationsLayer: L.MarkerClusterGroup;
  markerClusterData = [];

  private map: LeafletMap;
  center: LatLng = latLng(51.2, 4.14);


  private visibleFields = {
    0: ['VHAS', 'VHAG', 'NAAM', 'CATC', 'LBLCATC', 'BEKNR', 'BEKNAAM', 'STRMGEB', 'KWALDOEL', 'LBLKWAL', 'LBLGEO', 'VHAZONENR', 'LENGTE', 'WTRLICHC'],
    1: ['WVLC', 'Versie', 'NAAM', 'WTRLICHC'],
    3: ['GEMEENTE', 'NISCODE', 'NISCODE_PR', 'PROVINCIE'],
  };
  selected = new Map();

  private layerMetadata = new Map();
  open = false;
  private clickedLatlng: LatLng;

  constructor(private locationsService: LocationsService) {
  }

  ngOnInit(): void {
    this.setup();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private setup() {
    this.locationsLayer = L.markerClusterGroup({removeOutsideVisibleBounds: true, spiderfyOnMaxZoom: false, disableClusteringAtZoom: 19});


    this.locationsService.latestVhaVersion().pipe(take(1)).subscribe(version => {
      this.initLegend(version);

      this.orthoLayer = dynamicMapLayer(
        {
          url: 'https://gisservices.inbo.be/arcgis/rest/services/Orthofoto_WM/MapServer',
          layers: [0]
        }
      );

      this.watercourseLayer = dynamicMapLayer(
        {
          url: version.value,
          layers: [0]
        }
      );

      this.blueLayer = dynamicMapLayer(
        {
          url: version.value,
          layers: [1]
        }
      );

      this.townLayer = dynamicMapLayer(
        {
          url: version.value,
          layers: [3]
        }
      );

      const basemapLayer1 = basemapLayer('Topographic');

      this.layers = [
        basemapLayer1,
        this.newLocationLayerGroup,
        this.highlightSelectionLayer
      ];

      if (this.fishingPointsLayerVisible) {
        this.layers.push(this.locationsLayer);
      }
      if (this.watercoursesLayerVisible) {
        this.layers.push(this.watercourseLayer);
      }
      if (this.blueLayerVisible) {
        this.layers.push(this.blueLayer);
      }

      this.layersControl = {
        baseLayers: {
          Ortho: basemapLayer1,
          Orthofoto: this.orthoLayer
        },
        overlays: {
          Vispunten: this.locationsLayer,
          Waterlopen: this.watercourseLayer,
          'Stilstaande wateren': this.blueLayer,
          Gemeente: this.townLayer,
        }
      };

      this.subscription.add(
        this.locationsService.getFishingPointsFeatures(this.projectCode).subscribe(fishingPointFeatures => {
          fishingPointFeatures.forEach(fpf => {
            const latlng = latLng(fpf.x, fpf.y);
            const m = circleMarker(latlng, {
              fill: true,
              fillColor: '#DC2626',
              fillOpacity: 100,
              radius: 7,
              stroke: false
            });
            m.on('click', (event: LeafletMouseEvent) => {
              this.clickedLatlng = event.latlng;
              const layer = event.target;
              this.clearLocationsSelectedStyle();

              layer.setStyle({
                stroke: true,
              });

              const filteredProperties = {
                CODE: fpf.code,
                DESCRIPTION: fpf.description,
                X: fpf.x,
                Y: fpf.y
              };
              this.selected.set(4, filteredProperties);
            });
            this.locationsLayer.addLayer(m);

          });
          this.layerMetadata.set(4, {name: 'Vispunt'});
        })
      );

      this.loaded.emit();
    });


  }

  private clearLocationsSelectedStyle() {
    this.locationsLayer.eachLayer((layer1: CircleMarker) => {
      layer1.setStyle({
        stroke: false,
      });
    });
    this.selected.delete(4);
  }

  mapReady(map: LeafletMap) {
    this.map = map;
  }

  zoomTo(latlng: LatLng) {
    this.map.setView(latlng, 15);
    this.locationsLayer.getLayers().forEach((value: CircleMarker) => {
      if (value.getLatLng().equals(latlng)) {
        this.clearLocationsSelectedStyle();
        value.setStyle({stroke: true});
      }
    });
  }

  private initLegend(version: VhaUrl) {
    const fl0 = featureLayer({url: `${version.value}/0`});
    const fl1 = featureLayer({url: `${version.value}/1`});
    const fl3 = featureLayer({url: `${version.value}/3`});

    fl0.metadata((error, metadata) => this.convertMetadataToLegend(metadata));
    fl1.metadata((error, metadata) => this.convertMetadataToLegend(metadata));
    fl3.metadata((error, metadata) => this.convertMetadataToLegend(metadata));

  }

  private convertMetadataToLegend(metadata) {
    this.layerMetadata.set(metadata.id, metadata);

    const uniqueValueInfos = metadata.drawingInfo.renderer.uniqueValueInfos as [any];
    if (uniqueValueInfos === undefined) {
      return;
    }

    uniqueValueInfos.forEach(value => {
      this.legend.set(value.label, value.symbol.color.join(','));
    });
  }

  clearNewLocationMarker() {
    this.newLocationLayerGroup.clearLayers();
  }

  replaceNewLocationMarker(latlng: LatLng) {
    const m = marker(latlng, {draggable: this.canAddPoints});

    this.newLocationLayerGroup.clearLayers();
    this.newLocationLayerGroup.addLayer(m);

    this.center = latlng;
  }

  onDoubleClick(e: LeafletMouseEvent) {
    if (!this.canAddPoints) {
      return;
    }

    e.originalEvent.stopPropagation();
    const m = marker(e.latlng, {draggable: true});

    const that = this;

    m.on('dragend', (event: DragEndEvent) => {
      that.pointAdded.emit(m.getLatLng());
    });
    this.newLocationLayerGroup.clearLayers();
    this.newLocationLayerGroup.addLayer(m);

    this.pointAdded.emit(e.latlng);

  }

  public queryNearbyWatercourses() {
    const coordinate = (this.newLocationLayerGroup.getLayers()[0] as Marker).getLatLng();
    this.watercourseLayer.query().layer(0).nearby(coordinate, 5).run((error, featureCollection, response) => {
      this.nearbyWatercoursesFound.emit(featureCollection);
    });
  }

  clickMap(e: LeafletMouseEvent) {
    if (this.clickedLatlng !== e.latlng) {
      this.clearLocationsSelectedStyle();
    }
    this.clickedLatlng = e.latlng;
    this.highlightSelectionLayer.clearLayers();
    const coordinate = e.latlng;
    this.updateSelections(coordinate);
  }

  public updateSelections(coordinate: LatLng) {
    this.updateWatercourseSelection(coordinate);
    this.updateBlueLayerSelection(coordinate);
    this.updateTownLayerSelection(coordinate);
  }

  public updateTownLayerSelection(coordinate: LatLng) {
    this.townLayer.identify().on(this.map).layers('all:3').at(coordinate).run((error, featureCollection) => {
      if (error) {
        return;
      }

      this.selected.delete(3);
      this.selectFeature(featureCollection, 3);
      this.townLayerSelected.emit(this.selected.get(3));
    });
  }

  public updateBlueLayerSelection(coordinate: LatLng) {
    if (this.map.hasLayer(this.blueLayer)) {
      this.blueLayer.identify().on(this.map).layers('visible:1').at(coordinate).run((error, featureCollection) => {
        if (error) {
          return;
        }

        this.selected.delete(1);
        this.selectFeature(featureCollection, 1);
        this.blueLayerSelected.emit(this.selected.get(1));
      });
    }
  }

  public updateWatercourseSelection(coordinate: LatLng) {
    if (this.map.hasLayer(this.watercourseLayer)) {
      this.watercourseLayer.identify().on(this.map).layers('visible:0').at(coordinate).run((error, featureCollection) => {
        if (error) {
          return;
        }

        this.selected.delete(0);
        this.selectFeature(featureCollection, 0);
        this.vhaLayerSelected.emit(this.selected.get(0));
      });
    }
  }

  private selectFeature(featureCollection, layerId: number) {
    featureCollection.features.forEach(feature => {
      if (this.selected.has(layerId)) {
        return;
      }

      if (layerId !== 3) {
        this.highlightSelectionLayer.addLayer(L.geoJSON(feature, {style: {weight: 6}}));
      }

      const filteredProperties = {};

      for (const propertiesKey in feature.properties) {
        if (feature.properties.hasOwnProperty(propertiesKey)) {
          const fields = this.visibleFields[layerId] as string[];

          if (fields.indexOf(propertiesKey) > -1) {
            filteredProperties[propertiesKey] = feature.properties[propertiesKey];
          }
        }
      }
      console.log('set layer id ', layerId, filteredProperties);
      this.selected.set(layerId, filteredProperties);
    });
  }

  setCenter(latlng: LatLng) {
    this.options.center = latlng;
    this.center = latlng;
  }

  layerName(layer: number) {
    return this.layerMetadata.get(layer)?.name;
  }

  closeSelection() {
    this.open = false;
  }

  openInfo() {
    this.open = true;
  }
}

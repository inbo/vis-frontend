import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from 'rxjs';
import * as L from 'leaflet';
import {featureGroup, icon, LatLng, latLng, Layer, layerGroup, LeafletMouseEvent, Map as LeafletMap, MapOptions, marker} from 'leaflet';
import {LeafletControlLayersConfig} from '@asymmetrik/ngx-leaflet/src/leaflet/layers/control/leaflet-control-layers-config.model';
import {basemapLayer, dynamicMapLayer, DynamicMapLayer, featureLayer} from 'esri-leaflet';
import * as geojson from 'geojson';
import {LocationsService} from '../../../services/vis.locations.service';
import {take} from 'rxjs/operators';
import {VhaUrl} from '../../../domain/location/vha-version';
import {FeatureSelection} from "./feature-selection";

@Component({
  selector: 'app-fishing-points-map',
  templateUrl: './fishing-points-map.component.html'
})
export class FishingPointsMapComponent implements OnInit, OnDestroy {

  @Input() projectCode;
  @Input() zoomLevel = 8;
  @Input() canAddPoints = false;
  @Output() pointAdded = new EventEmitter<LatLng>();
  @Output() featureSelected = new EventEmitter<FeatureSelection>();
  @Output() vhaZoneSelection = new EventEmitter<FeatureSelection>();
  @Input() visibleLayers: number[] = [0, 1];
  private subscription = new Subscription();

  options: MapOptions = {
    maxZoom: 19,
    doubleClickZoom: false
  };

  layersControl: LeafletControlLayersConfig;

  layers: Layer[];

  legend = new Map();

  newLocationLayerGroup = featureGroup();
  selectedLayer = layerGroup();

  private dml: DynamicMapLayer;

  features: geojson.Feature[] = [];
  locationsLayer: L.MarkerClusterGroup;
  markerClusterData = [];

  private map: LeafletMap;
  center: LatLng = latLng(51.2, 4.14);


  private visibleFields = {
    0: ['BEHEER', 'BEKNAAM', 'BEKNR', 'CATC', 'KWALDOEL', 'LBLCATC', 'LBLGEO', 'LBLKWAL', 'LENGTE', 'NAAM', 'OIDN', 'REGCODE', 'REGCODE1', 'STRMGEB', 'VHAG', 'VHAS', 'VHAZONENUR', 'WTRLICHC'],
    1: ['OMTWVL', 'OPPWVL', 'WTRLICHC', 'WVLC', 'Versie'],
    2: ['NAAMVHAZON', 'VHAZONENR'],
  };

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

      this.dml = dynamicMapLayer(
        {
          url: version.value,
          layers: this.visibleLayers
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
          Ortho: basemapLayer1,
        },
        overlays: {
          Vispunten: this.locationsLayer
        }
      };

      this.subscription.add(
        this.locationsService.getFishingPointsFeatures(this.projectCode).subscribe(fishingPointFeatures => {
          fishingPointFeatures.forEach(fpf => {
            const latlng = latLng(fpf.x, fpf.y);
            const m = marker(latlng, {
              icon: icon({
                iconUrl: 'assets/images/marker.png'
              })
            });
            m.on('click', () => {
              const filteredProperties = {
                layer: 3,
                properties: {
                  CODE: fpf.code,
                  DESCRIPTION: fpf.description,
                  X: fpf.x,
                  Y: fpf.y
                }
              };
              this.featureSelected.emit(filteredProperties);
            });
            this.locationsLayer.addLayer(m);
          });
        })
      );
    });

  }

  mapReady(map: LeafletMap) {
    this.map = map;
  }

  zoomTo(latlng: LatLng) {
    this.map.setView(latlng, 15);
  }

  private initLegend(version: VhaUrl) {
    const fl0 = featureLayer({url: `${version.value}/0`});
    const fl1 = featureLayer({url: `${version.value}/1`});
    const fl2 = featureLayer({url: `${version.value}/2`});

    fl0.metadata((error, metadata) => this.convertMetadataToLegend(metadata));
    fl1.metadata((error, metadata) => this.convertMetadataToLegend(metadata));
    fl2.metadata((error, metadata) => this.convertMetadataToLegend(metadata));

  }

  private convertMetadataToLegend(metadata) {
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
    this.dml.identify().on(this.map).layers('all:' + this.visibleLayers.join(',')).at(e.latlng).run((error, featureCollection) => {
      if (error) {
        return;
      }

      this.selectedLayer.clearLayers();

      if (featureCollection.features.length > 0) {
        const feature = featureCollection.features[0] as geojson.Feature;
        this.selectedLayer.addLayer(L.geoJSON(feature));

        // @ts-ignore
        const {layerId} = feature;

        const filteredProperties = {
          layer: layerId,
          properties: {}
        };

        // tslint:disable-next-line:forin
        for (const propertiesKey in feature.properties) {
          // @ts-ignore
          const fields = this.visibleFields[layerId] as string[];

          if (fields.indexOf(propertiesKey) > -1) {
            filteredProperties.properties[propertiesKey] = feature.properties[propertiesKey];
          } else {
            console.log(layerId, propertiesKey, feature.properties[propertiesKey]);
          }
        }
        this.featureSelected.emit(filteredProperties);

      } else {
        this.featureSelected.emit({layer: -1, properties: {}});
      }
    });

    this.dml.identify().on(this.map).layers('all:2').at(e.latlng).run((error, featureCollection) => {
      if (error) {
        return;
      }

      if (featureCollection.features.length > 0) {
        const feature = featureCollection.features[0] as geojson.Feature;

        const filteredProperties = {
          layer: 2,
          properties: {}
        };

        // tslint:disable-next-line:forin
        for (const propertiesKey in feature.properties) {
          // @ts-ignore
          const fields = this.visibleFields[2] as string[];

          if (fields.indexOf(propertiesKey) > -1) {
            filteredProperties.properties[propertiesKey] = feature.properties[propertiesKey];
          }
        }
        this.vhaZoneSelection.emit(filteredProperties);

      } else {
        this.vhaZoneSelection.emit({layer: 2, properties: {}});
      }
    });
  }

  setCenter(latlng: LatLng) {
    this.options.center = latlng;
    this.center = latlng;
  }

  changeActiveLayer(layer: number, $event: Event) {
    const isChecked = ($event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.visibleLayers.push(layer);
    } else {
      this.visibleLayers = this.visibleLayers.filter(value => value !== layer);
    }

    this.dml.setLayers(this.visibleLayers);
  }

  isActive(value: number): boolean {
    return this.visibleLayers
      .indexOf(value) >= 0;
  }
}

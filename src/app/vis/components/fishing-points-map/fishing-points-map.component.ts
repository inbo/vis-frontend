/// <reference types='@runette/leaflet-fullscreen' />
import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import * as L from 'leaflet';
import {
    CircleMarker,
    featureGroup,
    GeoJSON,
    LatLng,
    latLng,
    Layer,
    layerGroup,
    LeafletMouseEvent,
    Map as LeafletMap,
    MapOptions,
    marker,
    tooltip,
} from 'leaflet';
import 'leaflet-defaulticon-compatibility';
import * as esri_geo from 'esri-leaflet-geocoder';
import 'leaflet.locatecontrol';
import {dynamicMapLayer, DynamicMapLayer, featureLayer} from 'esri-leaflet';
import {LocationsService} from '../../../services/vis.locations.service';
import {mapTo, switchMap, take, tap} from 'rxjs/operators';
import {VhaUrl} from '../../../domain/location/vha-version';
import {FishingPoint} from '../../../domain/location/fishing-point';
import {LayerId} from './layer-id.enum';
import {VhaBlueLayerSelectionEvent} from './vha-blue-layer-selection-event.model';
import {GeoJsonProperties} from 'geojson';
import {BLUE_LAYER_FIELD} from './blue-layer-field.enum';
import {BRU_WATERCOURSE_FIELD} from './bru-watercourse-field.enum';
import {TOWN_LAYER_FIELD} from './town-layer-field.enum';
import {VHA_WATERCOURSE_FIELD} from './vha-watercourse-field.enum';
import {TownLayerSelectionEvent} from './town-layer-selection-event.model';
import {LeafletControlLayersConfig} from '@asymmetrik/ngx-leaflet';

@Component({
    selector: 'app-fishing-points-map',
    templateUrl: 'fishing-points-map.component.html',
    styleUrls: ['fishing-points-map.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class FishingPointsMapComponent implements OnInit, OnDestroy {

    @Input() mapHeight = '24rem';
    @Input() projectCode; // Get fishing points for a specific project, all fishing points are retrieved when null
    @Input() zoomLevel = 8; // Default zoom level
    @Input() canAddPoints = false; // To be able to add a single new point to the map
    @Input() fishingPointsLayerVisible = true;
    @Input() blueLayerVisible = true;
    @Input() watercoursesLayerVisible = true;
    @Input() townsLayerVisible = true;
    @Input() tooltipsVisible = true;
    @Input() filter: any;
    @Input() highlightPoint: FishingPoint;
    @Input() enableSidebar = true;
    @Input() disableInteraction = false;
    @Input() disableClustering = false;
    @Output() pointAdded = new EventEmitter<LatLng>();
    @Output() nearbyWatercoursesFound = new EventEmitter<any>();
    @Output() loaded = new EventEmitter<any>();
    @Output() blueLayerSelected = new EventEmitter<VhaBlueLayerSelectionEvent>();
    @Output() vhaLayerSelected = new EventEmitter<VhaBlueLayerSelectionEvent>();
    @Output() townLayerSelected = new EventEmitter<TownLayerSelectionEvent>();
    options: MapOptions = {
        maxZoom: 19,
        doubleClickZoom: false,
    };
    fullscreenOptions: any = {
        position: 'topleft',
        title: 'View Fullscreen',
        titleCancel: 'Exit Fullscreen',
    };
    layersControl: LeafletControlLayersConfig;
    legend = new Map();
    layers: Array<Layer>;
    newLocationLayerGroup = featureGroup();
    highlightSelectionLayer = layerGroup();
    features: Array<GeoJSON.Feature> = [];
    locationsLayer: L.FeatureGroup;
    searchLayer: L.LayerGroup;
    markerClusterData = [];
    map: LeafletMap;
    center: LatLng = latLng(51.2, 4.14);
    openSelectionPanel = false;
    showTooltips = true;
    selected = new Map<LayerId, { [key: string]: string }>();
    private readonly defaultMarkerIcon = L.divIcon({
        className: 'fishing-point-marker-container',
        html: '<div class="fishing-point-marker"></div>',
        iconSize: [55, 55],
    });
    private readonly selectedMarkerIcon = L.divIcon({
        className: 'fishing-point-marker-container',
        html: `<div class="fishing-point-marker">
                <div class="hotspot main-wrapper">
                  <div class="hotspot dots-container">
                    <div class="hotspot dot1"></div>
                    <div class="hotspot dot2"></div>
                    <div class="hotspot dot3"></div>
                  </div>
                </div>
                </div>`,
        iconSize: [55, 55],
    });
    private readonly highlightedMarkerClass = 'pulse';
    private subscription = new Subscription();
    private orthoLayer: DynamicMapLayer;
    private watercourseLayer: DynamicMapLayer;
    private blueLayer: DynamicMapLayer;
    private townLayer: DynamicMapLayer;
    private visibleFields = {
        [LayerId.VHA_WATERCOURSE_LAYER]: [
            VHA_WATERCOURSE_FIELD.NAAM,
            VHA_WATERCOURSE_FIELD.BEKNAAM,
            VHA_WATERCOURSE_FIELD.WTRLICHC,
            VHA_WATERCOURSE_FIELD.STRMGEB,
            VHA_WATERCOURSE_FIELD.BEKNR,
            VHA_WATERCOURSE_FIELD.CATC,
            VHA_WATERCOURSE_FIELD.LBLCATC,
            VHA_WATERCOURSE_FIELD.KWALDOEL,
            VHA_WATERCOURSE_FIELD.LBLGEO,
            VHA_WATERCOURSE_FIELD.LBLKWAL,
            VHA_WATERCOURSE_FIELD.LENGTE,
            VHA_WATERCOURSE_FIELD.VHAG,
            VHA_WATERCOURSE_FIELD.VHAS,
            VHA_WATERCOURSE_FIELD.VHAZONENR,
        ],
        [LayerId.BLUE_LAYER]: [
            BLUE_LAYER_FIELD.NAAM,
            BLUE_LAYER_FIELD.WVLC,
            BLUE_LAYER_FIELD.WTRLICHC,
            BLUE_LAYER_FIELD.VERSIE,
        ],
        [LayerId.TOWN_LAYER]: [
            TOWN_LAYER_FIELD.GEMEENTE,
            TOWN_LAYER_FIELD.PROVINCIE,
            TOWN_LAYER_FIELD.NISCODE,
            TOWN_LAYER_FIELD.NISCODE_PR,
        ],
        [LayerId.BRU_WATERCOURSE_LAYER]: [
            BRU_WATERCOURSE_FIELD.TYPE,
            BRU_WATERCOURSE_FIELD.NAAM,
            BRU_WATERCOURSE_FIELD.BESCHRIJVING,
            BRU_WATERCOURSE_FIELD.CODECAT,
            BRU_WATERCOURSE_FIELD.CATEGORIE,
        ],
    };
    private layerMetadata = new Map();
    private clickedLatlng: LatLng;

    constructor(private locationsService: LocationsService,
                private changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.setup();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    updateFishingPointsLayer(filter: any): Observable<void> {
        this.locationsLayer.clearLayers();

        return this.locationsService
            .getFishingPointsFeatures(this.projectCode, filter)
            .pipe(
                take(1),
                tap(fishingPointFeatures => {
                    fishingPointFeatures.forEach(fishingPointFeature => {
                        const latlng = latLng(fishingPointFeature.lat, fishingPointFeature.lng);
                        const marker = L.marker(latlng, {icon: this.defaultMarkerIcon});

                        const fishingPointLabel = document.createElement('div');
                        fishingPointLabel.innerHTML = `<p>${fishingPointFeature.code}</p>
                                              <p>${fishingPointFeature.watercourse || ''}</p>`;
                        fishingPointLabel.style.textAlign = 'center';
                        marker
                            .bindTooltip(
                                tooltip({
                                    direction: 'top',
                                    permanent: true,
                                    offset: [0, -7],
                                }).setContent(fishingPointLabel));

                        marker.on('click', async (event: LeafletMouseEvent) => {
                            L.DomEvent.stopPropagation(event);
                            this.clearAllHightLights();
                            this.clickedLatlng = event.latlng;
                            const layer = event.target;

                            this.highlightCirclemarker(layer);

                            const filteredProperties = {};
                            filteredProperties['CODE'] = fishingPointFeature.code;
                            filteredProperties['DESCRIPTION'] = fishingPointFeature.description;
                            filteredProperties['X'] = fishingPointFeature.x;
                            filteredProperties['Y'] = fishingPointFeature.y;
                            filteredProperties['lat'] = fishingPointFeature.lat;
                            filteredProperties['lng'] = fishingPointFeature.lng;

                            // const townInformation = await this.getTownNameForCoordinates(this.clickedLatlng);
                            this.updateSelections(this.clickedLatlng, false);
                            this.selected.set(LayerId.FISHING_POINT_LAYER, filteredProperties);

                            this.openSelection();
                        });

                        marker.addTo(this.locationsLayer);

                    });
                    this.layerMetadata.set(LayerId.FISHING_POINT_LAYER, {name: 'Vispunt'});

                }),
                mapTo(undefined),
            );
    }

    mapReady(map: LeafletMap) {
        this.map = map;
        L.control.locate({icon: 'fa fa-map-marker-alt'}).addTo(this.map);
    }

    zoomTo(latlng: LatLng) {
        this.map.setView(latlng, 15);
        this.locationsLayer.getLayers()
            .forEach((value: L.Marker) => {
                if (value.getLatLng().equals(latlng)) {
                    this.clearLocationsSelectedStyle();
                    this.highlightCirclemarker(value);
                }
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

        m.on('dragend', () => {
            that.pointAdded.emit(m.getLatLng());
        });
        this.newLocationLayerGroup.clearLayers();
        this.newLocationLayerGroup.addLayer(m);

        this.pointAdded.emit(e.latlng);

    }

    clickMap(e: LeafletMouseEvent) {
        this.clearAllHightLights();
        this.clickedLatlng = e.latlng;
        this.updateSelections(e.latlng);
    }

    public updateSelections(coordinate: LatLng, highlight = true) {
        this.closeSelection();
        this.updateTownLayerSelection(coordinate, highlight);
        this.updateVHAWatercourseSelection(coordinate, highlight);
        this.updateBRUWatercourseSelection(coordinate, highlight);
        this.updateBlueLayerSelection(coordinate, highlight);
    }

    public updateTownLayerSelection(coordinate: LatLng, highlight: boolean) {
        this.townLayer.identify().on(this.map).layers(`all:${LayerId.TOWN_LAYER}`).at(coordinate)
            .run((error, featureCollection) => {
                if (error) {
                    return;
                }

                this.selected.delete(LayerId.TOWN_LAYER);
                this.selectFeature(featureCollection, LayerId.TOWN_LAYER, highlight);
                this.townLayerSelected.emit({
                    layerId: LayerId.TOWN_LAYER,
                    infoProperties: this.selected.get(LayerId.TOWN_LAYER),
                });
            });
    }

    public updateBlueLayerSelection(coordinate: LatLng, highlight: boolean) {
        if (this.map.hasLayer(this.blueLayer)) {
            this.blueLayer.identify().on(this.map).layers(`visible:${LayerId.BLUE_LAYER}`).at(coordinate).run((error, featureCollection) => {
                if (error) {
                    return;
                }

                this.selected.delete(LayerId.BLUE_LAYER);
                this.selectFeature(featureCollection, LayerId.BLUE_LAYER, highlight);
                if (this.selected.get(LayerId.BLUE_LAYER)) {
                    this.blueLayerSelected.emit({
                        layerId: LayerId.BLUE_LAYER,
                        coordinates: {lat: coordinate.lat, lng: coordinate.lng},
                        infoProperties: this.selected.get(LayerId.BLUE_LAYER),
                    });
                }
            });
        }
    }

    public updateVHAWatercourseSelection(coordinate: LatLng, highlight: boolean) {
        if (this.map.hasLayer(this.watercourseLayer)) {
            this.watercourseLayer
                .identify()
                .on(this.map)
                .layers(`visible:${LayerId.VHA_WATERCOURSE_LAYER}`)
                .at(coordinate)
                .run((error, featureCollection) => {
                    if (error) {
                        return;
                    }

                    this.selected.delete(LayerId.VHA_WATERCOURSE_LAYER);
                    this.selectFeature(featureCollection, LayerId.VHA_WATERCOURSE_LAYER, highlight);
                    if (this.selected.get(LayerId.VHA_WATERCOURSE_LAYER)) {
                        this.vhaLayerSelected.emit({
                            layerId: LayerId.VHA_WATERCOURSE_LAYER,
                            coordinates: {lat: coordinate.lat, lng: coordinate.lng},
                            infoProperties: this.selected.get(LayerId.VHA_WATERCOURSE_LAYER),
                        });
                    }
                });
        }
    }

    public updateBRUWatercourseSelection(coordinate: LatLng, highlight: boolean) {
        if (this.map.hasLayer(this.watercourseLayer)) {
            this.watercourseLayer.identify().on(this.map).layers('visible:4').at(coordinate).run((error, featureCollection) => {
                if (error) {
                    return;
                }

                this.selected.delete(LayerId.BRU_WATERCOURSE_LAYER);
                this.selectFeature(featureCollection, LayerId.BRU_WATERCOURSE_LAYER, highlight);
                if (this.selected.get(LayerId.BRU_WATERCOURSE_LAYER)) {
                    this.vhaLayerSelected.emit({
                        layerId: LayerId.BRU_WATERCOURSE_LAYER,
                        coordinates: {lat: coordinate.lat, lng: coordinate.lng},
                        infoProperties: this.selected.get(LayerId.BRU_WATERCOURSE_LAYER),
                    });
                }
            });
        }
    }

    setCenter(latlng: LatLng) {
        this.options.center = latlng;
        this.center = latlng;
    }

    layerName(layer: number) {
        return this.layerMetadata.get(layer)?.name;
    }

    closeSelection() {
        this.openSelectionPanel = false;
    }

    openSelection() {
        this.openSelectionPanel = this.enableSidebar;
        this.changeDetectorRef.detectChanges();

    }

    toggleTooltips() {
        this.showTooltips = !this.showTooltips;
        if (this.showTooltips) {
            document.getElementsByClassName('leaflet-tooltip-pane').item(0).classList.remove('invisible');
        } else {
            document.getElementsByClassName('leaflet-tooltip-pane').item(0).classList.add('invisible');
        }
    }

    private highlightCirclemarker(marker: L.Marker) {
        marker.setIcon(this.selectedMarkerIcon);
    }

    private clearAllHightLights(): void {
        this.clearLocationsSelectedStyle();
        this.highlightSelectionLayer.clearLayers();
    }

    private setup() {
        this.locationsLayer = L.markerClusterGroup({
            removeOutsideVisibleBounds: true,
            spiderfyOnMaxZoom: true,
            disableClusteringAtZoom: this.disableClustering ? undefined : 19,
        });

        this.searchLayer = L.layerGroup();

        this.locationsService.latestVhaVersion()
            .pipe(
                take(1),
                tap(version => this.initLegend(version)),
                tap(version => this.initializeLayers(version)),
                switchMap(() => this.updateFishingPointsLayer(this.filter)),
                tap(() => {
                    if (this.tooltipsVisible !== this.showTooltips) {
                        this.toggleTooltips();
                    }
                }),
            )
            .subscribe(() => this.loaded.emit());
    }

    private initializeLayers(version: VhaUrl) {
        this.orthoLayer = dynamicMapLayer(
            {
                url: 'https://gisservices.inbo.be/arcgis/rest/services/Orthofoto_WM/MapServer',
                layers: [LayerId.VHA_WATERCOURSE_LAYER],
            },
        );

        this.watercourseLayer = dynamicMapLayer(
            {
                url: version.value,
                layers: [LayerId.VHA_WATERCOURSE_LAYER, LayerId.BRU_WATERCOURSE_LAYER],
            },
        );

        this.blueLayer = dynamicMapLayer(
            {
                url: version.value,
                layers: [LayerId.BLUE_LAYER],
            },
        );

        this.townLayer = dynamicMapLayer(
            {
                url: version.value,
                layers: [LayerId.TOWN_LAYER],
            },
        );

        const osmTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap',
        });

        this.layers = [
            osmTileLayer,
            this.newLocationLayerGroup,
            this.highlightSelectionLayer,
        ];

        this.layers.push(this.searchLayer);

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
                Kaart: osmTileLayer,
                Orthofoto: this.orthoLayer,
            },
            overlays: {
                Vispunten: this.locationsLayer,
                Waterlopen: this.watercourseLayer,
                'Stilstaande wateren': this.blueLayer,
                Gemeente: this.townLayer,
            },
        };

        // @ts-ignore
        const waterlopenSearch = esri_geo.mapServiceProvider({
            url: version.value,
            searchFields: ['NAAM', 'naam'],
            label: 'Waterlopen',
            layers: [LayerId.VHA_WATERCOURSE_LAYER, LayerId.BRU_WATERCOURSE_LAYER],
            formatSuggestion(feature) {
                return `${feature.properties.NAAM || feature.properties.naam}`;
            },
        });

        // @ts-ignore
        const watervlakkenSearch = esri_geo.mapServiceProvider({
            url: version.value,
            searchFields: ['NAAM', 'WVLC'],
            label: 'Watervlakken',
            layers: [LayerId.BLUE_LAYER],
            formatSuggestion(feature) {
                return `${feature.properties.NAAM} - ${feature.properties.WVLC}`;
            },
        });

        // @ts-ignore
        const streetSearch = esri_geo.geocodeServiceProvider({
            url: 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer',
            label: 'Straten',
            formatSuggestion(feature) {
                return feature.properties;
            },
        });

        // @ts-ignore
        const searchControl = esri_geo.geosearch({
            zoomToResult: true,
            placeholder: 'Zoek naar waterlopen/watervlakken/straten',
            title: 'Zoeken',
            useMapBounds: false,
            providers: [waterlopenSearch, watervlakkenSearch, streetSearch],
        });

        searchControl.addTo(this.map);

        searchControl.on('results', data => {
            this.searchLayer.clearLayers();
            for (let i = data.results.length - 1; i >= 0; i--) {
                this.searchLayer.addLayer(L.marker(data.results[i].latlng));
            }
        });
    }

    private clearLocationsSelectedStyle() {
        this.locationsLayer.eachLayer((layer: CircleMarker) => {
            layer.getElement() && L.DomUtil.removeClass(layer.getElement() as HTMLElement, this.highlightedMarkerClass);
        });
        this.selected.delete(LayerId.FISHING_POINT_LAYER);
    }

    private initLegend(version: VhaUrl) {
        const fl0 = featureLayer({url: `${version.value}/0`});
        const fl1 = featureLayer({url: `${version.value}/1`});
        const fl3 = featureLayer({url: `${version.value}/3`});
        const fl4 = featureLayer({url: `${version.value}/4`});

        fl0.metadata((error, metadata) => this.convertMetadataToLegend(metadata));
        fl1.metadata((error, metadata) => this.convertMetadataToLegend(metadata));
        fl3.metadata((error, metadata) => this.convertMetadataToLegend(metadata));
        // Layer 4, BRU_hydro contains mostly the same legend entries as layer 0, VHA_Waterlopen.
        fl4.metadata((error, metadata) => this.layerMetadata.set(metadata.id, metadata));

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

    private selectFeature(featureCollection: GeoJSON.FeatureCollection, layerId: LayerId, highlight: boolean) {
        featureCollection.features.forEach(feature => {
            if (this.selected.has(layerId)) {
                return;
            }
            if (highlight && layerId !== LayerId.TOWN_LAYER) {
                this.highlightSelectionLayer.addLayer(L.geoJSON(feature, {style: {weight: 6}}));
            }
            const enhancedProperties = this.getEnhancedPropertiesFromFeature(feature, layerId);
            this.selected.set(layerId, enhancedProperties);
        });
        if (featureCollection.features.length > 0 && layerId !== LayerId.TOWN_LAYER) {
            this.openSelection();
        }
    }

    private getEnhancedPropertiesFromFeature(feature, layerId: LayerId): { [key: string]: string } {
        const filteredProperties: { [key: string]: string } = {};
        this.visibleFields[layerId]
            .forEach(visibleField => {
                filteredProperties[visibleField] = feature.properties[visibleField];
            });
        return this.enhanceFeatureProperties(filteredProperties, layerId);
    }

    private enhanceFeatureProperties(featureProperties: { [key: string]: string }, layerId: LayerId): { [key: string]: string } {
        // Issue: #242, Add arrondissement to town layer feature properties for towns in Brussels
        if (layerId === LayerId.TOWN_LAYER) {
            if (featureProperties[TOWN_LAYER_FIELD.NISCODE]?.startsWith('21')) {
                featureProperties[TOWN_LAYER_FIELD.NISCODE_PR] = '21000';
                featureProperties[TOWN_LAYER_FIELD.PROVINCIE] = 'Arrondissement Brussel Hoofdstad';
            }
        }
        return featureProperties;
    }

    private getTownNameForCoordinates(coordinates: LatLng): Promise<{ [key: string]: string }> {
        return new Promise(resolve => {
            this.townLayer.identify()
                .on(this.map).layers('all:3')
                .at(coordinates)
                .run((error, featureCollection: GeoJSON.FeatureCollection) => {
                    if (error) {
                        return;
                    }
                    let properties: GeoJsonProperties = {};
                    if (featureCollection.features.length > 0) {
                        properties = this.getEnhancedPropertiesFromFeature(featureCollection.features[0], LayerId.TOWN_LAYER);
                    }

                    resolve(properties);
                });

        });
    }
}

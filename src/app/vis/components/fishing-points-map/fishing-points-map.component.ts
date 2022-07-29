/// <reference types='@runette/leaflet-fullscreen' />
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import * as L from 'leaflet';
import {
    circleMarker,
    CircleMarker,
    featureGroup,
    LatLng,
    latLng,
    Layer,
    layerGroup,
    LeafletMouseEvent,
    Map as LeafletMap,
    MapOptions,
    Marker,
    marker,
    tooltip,
} from 'leaflet';
import 'leaflet-defaulticon-compatibility';
import * as esri_geo from 'esri-leaflet-geocoder';
import 'leaflet.locatecontrol';
import {LeafletControlLayersConfig} from '@asymmetrik/ngx-leaflet/src/leaflet/layers/control/leaflet-control-layers-config.model';
import {dynamicMapLayer, DynamicMapLayer, featureLayer} from 'esri-leaflet';
import * as geojson from 'geojson';
import {LocationsService} from '../../../services/vis.locations.service';
import {mapTo, switchMap, take, tap} from 'rxjs/operators';
import {VhaUrl} from '../../../domain/location/vha-version';
import {FishingPoint} from '../../../domain/location/fishing-point';
import {NgxTippyService} from 'ngx-tippy-wrapper';

@Component({
    selector: 'app-fishing-points-map',
    templateUrl: './fishing-points-map.component.html',
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
    @Input() filter: any;
    @Input() highlightPoint: FishingPoint;

    @Output() pointAdded = new EventEmitter<LatLng>();
    @Output() nearbyWatercoursesFound = new EventEmitter<any>();
    @Output() loaded = new EventEmitter<any>();
    @Output() blueLayerSelected = new EventEmitter<any>();
    @Output() vhaLayerSelected = new EventEmitter<any>();
    @Output() townLayerSelected = new EventEmitter<any>();

    private subscription = new Subscription();

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

    layers: Layer[];
    private orthoLayer: DynamicMapLayer;
    private watercourseLayer: DynamicMapLayer;
    private blueLayer: DynamicMapLayer;
    private townLayer: DynamicMapLayer;
    newLocationLayerGroup = featureGroup();

    highlightSelectionLayer = layerGroup();

    features: geojson.Feature[] = [];
    locationsLayer: L.MarkerClusterGroup;
    searchLayer: L.LayerGroup;
    markerClusterData = [];

    map: LeafletMap;
    center: LatLng = latLng(51.2, 4.14);
    open = false;
    showTooltips = true;

    private visibleFields = {
        0: ['VHAS', 'VHAG', 'NAAM', 'CATC', 'LBLCATC', 'BEKNR', 'BEKNAAM', 'STRMGEB', 'KWALDOEL', 'LBLKWAL', 'LBLGEO', 'VHAZONENR', 'LENGTE', 'WTRLICHC'],
        1: ['WVLC', 'Versie', 'NAAM', 'WTRLICHC'],
        3: ['GEMEENTE', 'NISCODE', 'NISCODE_PR', 'PROVINCIE'],
        4: ['type', 'naam', 'beschrijvi', 'codecat', 'categorie'],
    };
    selected = new Map();

    private locationsLayerId = 5;
    private layerMetadata = new Map();
    private clickedLatlng: LatLng;

    constructor(private locationsService: LocationsService,
                private tippyService: NgxTippyService) {
    }

    ngOnInit(): void {
        this.setup();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private setup() {
        this.locationsLayer = L.markerClusterGroup({
            removeOutsideVisibleBounds: true,
            spiderfyOnMaxZoom: false,
            disableClusteringAtZoom: 19,
        });
        this.searchLayer = L.layerGroup();

        this.locationsService.latestVhaVersion()
            .pipe(
                take(1),
                tap(version => this.initLegend(version)),
                tap(version => this.initializeLayers(version)),
                switchMap(() => this.updateFishingPointsLayer(this.filter)),
            )
            .subscribe(() => this.loaded.emit());
    }

    private initializeLayers(version: VhaUrl) {
        this.orthoLayer = dynamicMapLayer(
            {
                url: 'https://gisservices.inbo.be/arcgis/rest/services/Orthofoto_WM/MapServer',
                layers: [0],
            },
        );

        this.watercourseLayer = dynamicMapLayer(
            {
                url: version.value,
                layers: [0, 4],
            },
        );

        this.blueLayer = dynamicMapLayer(
            {
                url: version.value,
                layers: [1],
            },
        );

        this.townLayer = dynamicMapLayer(
            {
                url: version.value,
                layers: [3],
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
            layers: [0, 4],
            formatSuggestion(feature) {
                return `${feature.properties.NAAM || feature.properties.naam}`;
            },
        });

        // @ts-ignore
        const watervlakkenSearch = esri_geo.mapServiceProvider({
            url: version.value,
            searchFields: ['NAAM', 'WVLC'],
            label: 'Watervlakken',
            layers: [1],
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

    updateFishingPointsLayer(filter: any): Observable<void> {
        this.locationsLayer.clearLayers();

        return this.locationsService
            .getFishingPointsFeatures(this.projectCode, filter)
            .pipe(
                tap(fishingPointFeatures => {
                    fishingPointFeatures.forEach(fishingPointFeature => {
                        const latlng = latLng(fishingPointFeature.lat, fishingPointFeature.lng);
                        const circleMark = circleMarker(latlng, {
                            fill: true,
                            fillColor: '#C04384',
                            fillOpacity: 100,
                            radius: 7,
                            stroke: false,
                        });
                        const fishingPointLabel = document.createElement('div');
                        fishingPointLabel.innerHTML = `<p>${fishingPointFeature.code}</p>
                                              <p>${fishingPointFeature.watercourse}</p>`;
                        fishingPointLabel.style.textAlign = 'center';
                        circleMark
                            .bindTooltip(
                                tooltip({
                                    direction: 'top',
                                    permanent: true,
                                    offset: [0, -7],
                                }).setContent(fishingPointLabel));

                        circleMark.on('click', (event: LeafletMouseEvent) => {
                            this.clickedLatlng = event.latlng;
                            const layer = event.target;
                            this.clearLocationsSelectedStyle();

                            layer.setStyle({
                                stroke: true,
                            });

                            const filteredProperties = {
                                CODE: fishingPointFeature.code,
                                DESCRIPTION: fishingPointFeature.description,
                                X: fishingPointFeature.x,
                                Y: fishingPointFeature.y,
                                lat: fishingPointFeature.lat,
                                lng: fishingPointFeature.lng,
                            };
                            this.selected.set(this.locationsLayerId, filteredProperties);
                            this.openInfo();
                        });
                        this.locationsLayer.addLayer(circleMark);

                    });
                    this.layerMetadata.set(this.locationsLayerId, {name: 'Vispunt'});
                }),
                mapTo(undefined),
            );
    }

    private clearLocationsSelectedStyle() {
        this.locationsLayer.eachLayer((layer: CircleMarker) => {
            layer.setStyle({
                stroke: false,
            });
        });
        this.selected.delete(this.locationsLayerId);
    }

    mapReady(map: LeafletMap) {
        this.map = map;
        L.control.locate({icon: 'fa fa-map-marker-alt'}).addTo(this.map);
    }

    zoomTo(latlng: LatLng) {
        this.map.setView(latlng, 15);
        this.locationsLayer.getLayers().forEach((value: CircleMarker) => {
            console.log('highlighting the dot');
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
        const fl4 = featureLayer({url: `${version.value}/4`});

        fl0.metadata((error, metadata) => this.convertMetadataToLegend(metadata));
        fl1.metadata((error, metadata) => this.convertMetadataToLegend(metadata));
        fl3.metadata((error, metadata) => this.convertMetadataToLegend(metadata));
        fl4.metadata((error, metadata) => this.convertMetadataToLegend(metadata));

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

        m.on('dragend', () => {
            that.pointAdded.emit(m.getLatLng());
        });
        this.newLocationLayerGroup.clearLayers();
        this.newLocationLayerGroup.addLayer(m);

        this.pointAdded.emit(e.latlng);

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
        this.updateVHAWatercourseSelection(coordinate);
        this.updateBRUWatercourseSelection(coordinate);
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

    public updateVHAWatercourseSelection(coordinate: LatLng) {
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

    public updateBRUWatercourseSelection(coordinate: LatLng) {
        if (this.map.hasLayer(this.watercourseLayer)) {
            this.watercourseLayer.identify().on(this.map).layers('visible:4').at(coordinate).run((error, featureCollection) => {
                if (error) {
                    return;
                }

                this.selected.delete(4);
                this.selectFeature(featureCollection, 4);
                this.vhaLayerSelected.emit(this.selected.get(4));
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

    toggleTooltips() {
        this.showTooltips = !this.showTooltips;
        if (this.showTooltips) {
            document.getElementsByClassName('leaflet-tooltip-pane').item(0).classList.remove('invisible');
        } else {
            document.getElementsByClassName('leaflet-tooltip-pane').item(0).classList.add('invisible');
        }
    }
}

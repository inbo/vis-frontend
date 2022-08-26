import {LayerId} from './layer-id.enum';

export interface VhaBlueLayerSelectionEvent {
    layerId: LayerId;
    coordinates: {lat: number, lng: number};
    infoProperties: { [key: string]: string };
}

import {LayerId} from './layer-id.enum';

export interface TownLayerSelectionEvent {
    layerId: LayerId;
    infoProperties: { [key: string]: string };
}

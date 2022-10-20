import {LayerId} from './layer-id.enum';

export interface TownLayerSelectionEvent {
    layerId: LayerId;
    infoProperties: Map<string, string>;
}

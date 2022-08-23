import {Coordinates} from '../../../domain/location/coordinates';

export interface VhaBlueLayerSelectionEvent {
    coordinates: Coordinates,
    infoProperties: { [key: string]: string }
}

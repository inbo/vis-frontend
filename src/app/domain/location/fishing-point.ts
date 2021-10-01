export interface FishingPoint {
  id: number;
  code: string;
  description: string;
  width: number;
  incline: number;
  titalWater: boolean;
  brackfishWater: boolean;
  fishingIndexType: string;

  x: number;
  y: number;
  lat: number;
  lng: number;
  snappedX: number;
  snappedY: number;
  snappedLat: number;
  snappedLng: number;

  vhag: number;
  vhas: number;
  watercourse: string;
  categoryCode: number;
  categoryDescription: string;
  basinNumber: number;
  basinName: string;
  flowArea: string;
  qualityTarget: number;
  qualityLabel: string;
  qualityGeoAccuracy: string;
  zoneNumber: number;
  length: number;
  puddleVersion: string;
  puddleCode: string;
  waterbodyVersion: string;
  waterbodyCode: string;
  lenticWaterbodyCode: string;
  lenticWaterbodyName: string;
}

export interface FishingPointFeature {
  id: number;
  code: string;
  description: string;
  x: number;
  y: number;
}

export interface FishingPointSearch {
  id: number;
  code: string;
  description: string;
}



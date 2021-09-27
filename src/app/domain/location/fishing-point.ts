export interface FishingPoint {
  id: number;
  code: string;
  description: string;
  incline: number;

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
  name: string;
  categoryCode: number;
  categoryDescription: string;
  basinNumber: number;
  basinName: string;
  flowArea: string;
  qualityTarget: number;
  qualityLabel: string;
  qualityGeoAccuracy: string;
  zoneNumber: number;
  waterbody: string;
  length: number;
  puddleVersion: string;
  puddleCode: string;
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



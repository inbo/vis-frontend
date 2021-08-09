export interface FishingPoint {
  id: number;
  code: string;
  description: string;
  slope: number;
  x: number;
  y: number;

  lat: number;
  lng: number;

  snappedX: number;
  snappedY: number;
  vhag: number;
  vhas: number;
  name: string;
  categoryValue: number;
  categoryName: string;
  basinNumber: number;
  basinName: string;
  flowArea: string;
  qualityTarget: number;
  qualityLabel: string;
  qualityLabelGeo: string;
  zoneNumber: number;
  waterCode: string;
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



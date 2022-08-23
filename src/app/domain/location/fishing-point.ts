export interface FishingPoint {
  id: number;
  code: string;
  description: string;
  width: number;
  incline: number;
  tidalWater: boolean;
  brackishWater: boolean;
  fishingIndexType: string;

  createUser: string;
  createDate: Date;

  municipality: string;
  province: string;
  nisCode: string;
  nisCodePr: string;

  x: number;
  y: number;
  lat: number;
  lng: number;
  snappedX: number;
  snappedY: number;
  snappedLat: number;
  snappedLng: number;

  // Blue layer
  isLentic: boolean;
  lenticCode: string;
  lenticCodeVersion: string;
  lenticName: string;
  lenticCodeVmm: string;

  // vha
  vhas: number;
  vhag: number;
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
  segmentLength: number;
  waterbodyCodeVmm: number;
}

export interface FishingPointFeature {
  id: number;
  code: string;
  description: string;
  watercourse: string;
  x: number;
  y: number;
  lat: number;
  lng: number;
}

export interface FishingPointSearch {
  id: number;
  code: string;
  description: string;
}



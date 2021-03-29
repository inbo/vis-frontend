export interface FishingPoint {
  id: number;
  code: string;
  description: string;
  slope: number;
  x: number;
  y: number;

  snappedX: number;
  snappedY: number;
  vhaId: number;
  vhag: number;
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



export interface ProjectFishingPoint {
  id: number;
  code: string;
  description: string;
  x: number;
  y: number;
  lat: number;
  lng: number;

  isLentic: boolean;
  lenticName: string;

  watercourse: string;
  basinName: string;
}

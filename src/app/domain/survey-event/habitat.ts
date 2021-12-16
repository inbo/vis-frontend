export interface Habitat {
  minDepth: number;
  maxDepth: number;
  waterLevel: string;
  shelters: string;
  pool: boolean;
  rapids: boolean;
  creeks: boolean;
  shore: string;
  slope: string;
  agriculture: string;
  meadow: string;
  trees: string;
  buildings: string;
  industry: boolean;
  current: string;
  fishPassage: boolean;
  soil: Soil;
  bottleneck: Bottleneck;
  vegetation: Vegetation;
}


export enum Agriculture {
  NONE, ONE, BOTH, UNKNOWN
}

export enum Buildings {
  NONE, LOWER_5, BETWEEN_5_10, HIGHER_10, UNKNOWN
}

export enum Current {
  DISTURBED, MODERATE, NOT_DISTURBED, UNKNOWN
}

export enum Meadow {
  NONE, ONE, BOTH, UNKNOWN
}

export enum Shore {
  REINFORCED, PARTIALLY_REINFORCED, NATURAL, UNKNOWN
}

export enum Slope {
  GENTLE, MODERATE, STEEP, UNKNOWN
}

export enum Trees {
  NONE, LOWER_10, BETWEEN_10_50, HIGHER_50, UNKNOWN
}

export enum Shelter {
  MANY, SOME, MODERATE, FEW, NONE, UNKNOWN
}

export enum WaterLevel {
  LOW, NORMAL, HIGH, UNKNOWN
}

export interface Soil {
  other: boolean;
  grint: boolean;
  clay: boolean;
  mudd: boolean;
  silt: boolean;
  stones: boolean;
  sand: boolean;
  unknown: boolean;
}

export interface Bottleneck {
  motorway: boolean;
  diver: boolean;
  mill: boolean;
  undefined: boolean;
  lock: boolean;
  reservoir: boolean;
  weir: boolean;
  decay: boolean;
  unknown: boolean;
}

export interface Vegetation {
  threadAlgae: boolean;
  filamentousAlgae: boolean;
  soilWaterPlants: boolean;
  unknown: boolean;
}

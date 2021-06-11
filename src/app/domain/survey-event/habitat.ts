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
  loop: string;
  fishPassage: boolean;
  soils: string[];
  bottlenecks: string[];
  vegetations: string[];
}


export enum Agriculture {
  NONE, ONE, BOTH, UNKNOWN
}

export enum Buildings {
  NONE, LOWER_5, BETWEEN_5_10, HIGHER_10, UNKNOWN
}

export enum Loop {
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

export enum Soil {
  SAND, CLAY, GRAVEL, MUD, SILT, STONES, OTHER
}

export enum Bottleneck {
  DECAY, MILL, UNDEFINED, DIVER, RESERVOIR, MOTORWAY, LOCK, WEIR
}

export enum Vegetation {
  FLOATING_AQUATIC_PLANTS, SOIL_AQUATIC_PLANTS, THREAD_ALGAE
}

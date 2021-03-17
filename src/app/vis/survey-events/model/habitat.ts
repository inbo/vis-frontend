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
  soils: string[];
  bottlenecks: string[];
  vegetations: string[];
}


export enum Agriculture {
  NONE, ONE, BOTH
}

export enum Buildings {
  NONE, LOWER_5, BETWEEN_5_10, HIGHER_10
}

export enum Loop {
  DISTURBED, MODERATE, NOT_DISTURBED
}

export enum Meadow {
  NONE, ONE, BOTH
}

export enum Shore {
  REINFORCED, PARTIALLY_REINFORCED, NATURAL
}

export enum Slope {
  GENTLE, MODERATE, STEEP
}

export enum Trees {
  NONE, LOWER_10, BETWEEN_10_50, HIGHER_50
}

export enum Shelter {
  MANY, SOME, MODERATE, FEW, NONE
}

export enum WaterLevel {
  LOW, NORMAL, HIGH
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

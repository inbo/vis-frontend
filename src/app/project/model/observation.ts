export interface ObservationId {
  value: number
}

export interface Observation {
  observationId: ObservationId;
  occurrence: Date;
  status: string;
  method: string;
  comment: string;
}



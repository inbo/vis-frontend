interface MeasurementId {
  value: number
}

export interface Measurement {
  measurementId: MeasurementId;
  taxonId: number;
  length: number;
  weight: number;
}



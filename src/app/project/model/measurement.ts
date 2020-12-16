interface MeasurementId {
  value: number
}

export interface Measurement {
  measurementId: MeasurementId;
  taxonId: number;
  amount: number;
  length: number;
  weight: number;
}



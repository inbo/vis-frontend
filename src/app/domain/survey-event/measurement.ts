export interface MeasurementId {
  value: number;
}

export interface Measurement {
  measurementId: MeasurementId;
  type: string;
  taxonId: number;
  amount: number;
  length: number;
  weight: number;
  comment: string;
  gender: string;
  lengthType: string;
  afvisBeurtNumber: number;
}



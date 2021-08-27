export interface MeasurementId {
  value: number;
}

export interface Measurement {
  id: number;
  type: string;
  taxonId: number;
  amount: number;
  length: number;
  weight: number;
  comment: string;
  gender: string;
  lengthType: string;
  afvisBeurtNumber: number;
  individualLengths: IndividualLength[];
}

export interface IndividualLength {
  id: number;
  length: number;
  comment: string;
}

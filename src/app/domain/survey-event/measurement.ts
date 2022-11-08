export interface MeasurementId {
  value: number;
}

export interface Taxon {
  id: number;
  code: string;
  nameDutch: string;
}

export interface Measurement {
  id: number;
  order: number;
  type: string;
  taxon: Taxon;
  amount: number;
  length: number;
  weight: number;
  comment: string;
  gender: string;
  lengthType: string;
  afvisBeurtNumber: number;
  dilutionFactor: number;
  isPortside: boolean;
  individualLengths: IndividualLength[];
}

export interface IndividualLength {
  id: number;
  length: number;
  comment: string;
}

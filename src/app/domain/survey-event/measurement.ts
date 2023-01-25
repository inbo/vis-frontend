import {TaxonDetail} from '../taxa/taxon-detail';

export interface MeasurementId {
  value: number;
}

export interface Measurement {
  id: number;
  order: number;
  type: string;
  taxon: TaxonDetail;
  amount: number;
  length: number;
  weight: number;
  comment: string;
  gender: string;
  lengthType: string;
  afvisBeurtNumber: number;
  dilutionFactor: number;
  portside: boolean;
  individualLengths: IndividualLength[];
}

export interface IndividualLength {
  id: number;
  length: number;
  comment: string;
}

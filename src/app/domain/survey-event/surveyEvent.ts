export interface SurveyEventOverview {
  surveyEventId: number;
  projectCode: string;
  projectId: number;
  occurrence: Date;
  status: string;
  municipality: string;
  method: string;
  comment: string;
  fishingPointCode: string;
  isLentic: boolean;
  lenticName: string;
  watercourse: string;
  basin: string;
  canEdit: boolean;
}

export interface SurveyEvent {
  surveyEventId: number;
  projectCode: string;
  occurrence: Date;
  status: string;
  method: string;
  comment: string;
  fishingPoint: FishingPoint;
  canEdit: boolean;
}

export interface FishingPoint {
  id: number;
  code: string;
  isLentic: boolean;
  lenticName: string;
  watercourse: string;
  basinName: string;
  x: number;
  y: number;
  lat: number;
  lng: number;
  description: string;
  width: number;
  municipality: string;
  province: string;
}

export interface SurveyEventParameters {
  parameters: SurveyEventCpueParameter[];
  hasParameters: boolean;
}

export interface SurveyEventCpueParameter {
  key: string;
  value: number;
  automatic: boolean;
}

export interface TaxonCpue {
  taxonId: number;
  taxonName: string;
  calculation: string;
  weightSum: number;
  taxaSum: number;
  weightCpue: number;
  taxaSumCpue: number;
  weightUnit: string;
  amountUnit: string;
  manualInput: boolean;
}



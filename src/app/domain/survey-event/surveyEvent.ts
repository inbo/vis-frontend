import {ProjectCode} from '../project/project';

export interface SurveyEventOverview {
  surveyEventId: SurveyEventId;
  projectCode: ProjectCode;
  occurrence: Date;
  status: string;
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
  surveyEventId: SurveyEventId;
  projectCode: ProjectCode;
  occurrence: Date;
  status: string;
  method: string;
  comment: string;
  fishingPoint: FishingPoint;
  canEdit: boolean;
}

export interface SurveyEventId {
  value: number;
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
  unit: string;
  manualInput: boolean;
}



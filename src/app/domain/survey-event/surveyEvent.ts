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
}

export interface CpueParameters {
  parameters: CpueParameter[];
  cpue: number;
  hasParameters: boolean;
}

export interface CpueParameter {
  key: string;
  value: number;
  automatic: boolean;
}



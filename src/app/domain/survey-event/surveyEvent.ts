import {ProjectCode} from '../project/project';

export interface SurveyEventId {
  value: number;
}

export interface FishingPoint {
  id: number;
  code: string;
  flowArea: string;
  name: string;
  waterbody: string;
  x: number;
  y: number;
  lat: number;
  lng: number;
  description: string;
  width: number;
}

export interface SurveyEvent {
  surveyEventId: SurveyEventId;
  projectCode: ProjectCode;
  occurrence: Date;
  status: string;
  method: string;
  comment: string;
  fishingPointCode: string;
  watercourse: string;
  basin: string;
  fishingPoint: FishingPoint;
  canEdit: boolean;
}

export interface CpueParameters {
  parameters: Map<string, number>;
  cpue: number;
  hasParameters: boolean;
}



import {ProjectCode} from '../project/project';

export interface SurveyEventId {
  value: number;
}

export interface FishingPoint {
  id: number;
  code: string;
  flowArea: string;
  name: string;
  waterCode: string;
  x: number;
  y: number;
  description: string;
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



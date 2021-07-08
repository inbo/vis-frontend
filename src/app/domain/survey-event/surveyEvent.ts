import {ProjectCode} from '../project/project';

export interface SurveyEventId {
  value: number;
}

export interface FishingPoint {
  code: string;
  flowArea: string;
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
  fishingPoint: FishingPoint;
}



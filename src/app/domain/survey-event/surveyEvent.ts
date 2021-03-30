export interface SurveyEventId {
  value: number;
}

export interface SurveyEvent {
  surveyEventId: SurveyEventId;
  occurrence: Date;
  status: string;
  method: string;
  comment: string;
}



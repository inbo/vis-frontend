export interface Import {
  filename: string;
  id: string;
  displayName: string;
  photoLink: string;
  webViewLink: string;
  createdTime: Date;
  modifiedTime: Date;
}

export interface ImportDetail {
  documentTitle: string;
  url: string;
  items: ImportProjectDetail[];
}

export interface ImportProjectDetail {
  project: ProjectDetail;
  surveyEvents: ImportSurveyEvent[];
}

export interface ProjectDetail {
  originalValue: string;
  code: string;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  valid: boolean;
}

export interface ImportSurveyEvent {
  fishingPoint: ImportSurveyEventFishingPoint;
  occurrence: ImportSurveyEventOccurrence;
  method: ImportSurveyEventMethod;
  comment: ImportSurveyEventComment;
  existingSurveyEventId: number;
  measurements: ImportMeasurement[];
}

export interface ImportMeasurement {
  taxon: ImportTaxon;
  amount: ImportAmount;
  weight: ImportWeight;
  length: ImportLength;
  totalWeight: ImportTotalWeight;
  comment: ImportComment;
  valid: boolean;
}


export interface ImportTaxon {
  originalValue: string;
  taxonId: number;
  lengthMin: number;
  lengthMax: number;
  weightMin: number;
  weightMax: number;
}

export interface ImportAmount {
  originalValue: string;
}

export interface ImportWeight {
  originalValue: string;
}

export interface ImportLength {
  originalValue: string;
}

export interface ImportTotalWeight {
  originalValue: string;
}

export interface ImportComment {
  originalValue: string;
}

export interface FishingPointDetail {
    name: string;
    valid: boolean;
    value: any;
}
export interface ImportSurveyEventFishingPoint {
  value: string;
  details?: FishingPointDetail[];
  id: number;
  valid: boolean;
}

export interface ImportSurveyEventOccurrence {
  originalValue: string;
  value: Date;
  valid: boolean;
  exception: string;
}

export interface ImportSurveyEventMethod {
  originalValue: string;
  methodCode: string;
  valid: boolean;
}

export interface ImportSurveyEventComment {
  value: string;
}

export interface CreateImportFileResult {
  spreadsheetId: string;
}

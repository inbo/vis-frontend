import {AsyncValidatorFn, FormGroup, ValidationErrors} from '@angular/forms';
import {EMPTY, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {SurveyEventsService} from '../../services/vis.surveyevents.service';
import {SurveyEvent} from '../../domain/survey-event/surveyEvent';

export function uniqueValidator(projectCode: string, surveyEventService: SurveyEventsService, surveyEvent?: SurveyEvent): AsyncValidatorFn {
  return (form: FormGroup): Observable<ValidationErrors | null> => {
    const location = form.get('location').value;
    const occurrenceDate = form.get('occurrenceDate').value;
    const method = form.get('method').value;

    if (surveyEvent && (surveyEvent.fishingPoint.id === location
      && new Date(surveyEvent.occurrence).toISOString() === new Date(occurrenceDate).toISOString()
      && surveyEvent.method === method)) {
      return EMPTY;
    }

    if (!location || !occurrenceDate || !method) {
      return EMPTY;
    }

    return surveyEventService.checkIfSurveyEventExists(projectCode, location, new Date(occurrenceDate).toISOString(),
      method).pipe(map(result => result.valid ? {uniqueSurveyEvent: true} : null));
  };
}

export function uniqueNewValidator(
  projectCode: string,
  location: number,
  existingMethod: string,
  surveyEventService: SurveyEventsService): AsyncValidatorFn {
  return (form: FormGroup): Observable<ValidationErrors | null> => {
    if (!form.get('occurrenceDate').value) {
      return EMPTY;
    }
    const newMethod = form.get('method').value;
    const method = newMethod ? newMethod : existingMethod;

    return surveyEventService.checkIfSurveyEventExists(projectCode, location, new Date(form.get('occurrenceDate').value).toISOString(),
      method).pipe(map(result => result.valid ? {uniqueSurveyEvent: true} : null));
  };
}

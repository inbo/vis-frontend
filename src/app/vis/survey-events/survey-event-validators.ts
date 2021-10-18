import {AsyncValidatorFn, FormGroup, ValidationErrors} from '@angular/forms';
import {EMPTY, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {SurveyEventsService} from '../../services/vis.surveyevents.service';

export function uniqueValidator(projectCode: string, surveyEventService: SurveyEventsService): AsyncValidatorFn {
  return (form: FormGroup): Observable<ValidationErrors | null> => {
    const location = form.get('location').value;
    const occurrenceDate = form.get('occurrenceDate').value;
    const method = form.get('method').value;

    if (!location || !occurrenceDate || !method) {
      return EMPTY;
    }

    return surveyEventService.checkIfSurveyEventExists(projectCode, location, new Date(occurrenceDate).toISOString(),
      method).pipe(map(result => result.valid ? {uniqueSurveyEvent: true} : null));
  };
}

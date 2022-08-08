import {AsyncValidatorFn, FormGroup, ValidationErrors} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {SurveyEventsService} from '../../services/vis.surveyevents.service';
import {isValid} from 'date-fns';

export function uniqueNewValidator(
    projectId: number,
    surveyEventService: SurveyEventsService): AsyncValidatorFn {
    return (form: FormGroup): Observable<ValidationErrors | null> => {
        const method = form.get('method').value;
        const occurrenceDate = new Date(form.get('occurrenceDate').value);
        const fishingPoint = form.get('fishingPointId').value;

        if (!method || !isValid(occurrenceDate) || !projectId || !fishingPoint) {
            return of({uniqueSurveyEvent: false});
        }
        return surveyEventService
            .searchSurveyEvents(
                fishingPoint,
                method,
                occurrenceDate,
                projectId)
            .pipe(
                map(result => result.length === 0 ? null : {uniqueSurveyEvent: false}),
            );
    };
}

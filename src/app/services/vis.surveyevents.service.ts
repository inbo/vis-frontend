import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AsyncPage} from '../shared-ui/paging-async/asyncPage';
import {Observable} from 'rxjs';
import {Measurement} from '../domain/survey-event/measurement';
import {SurveyEvent, SurveyEventOverview, SurveyEventParameters, TaxonCpue} from '../domain/survey-event/surveyEvent';
import {Parameters} from '../domain/survey-event/parameters';
import {Habitat} from '../domain/survey-event/habitat';
import {VisService} from './vis.service';
import {AsyncValidationResult} from './validation';
import {format} from 'date-fns';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class SurveyEventsService extends VisService {

    constructor(private http: HttpClient) {
        super();
    }

    getSurveyEvents(projectCode: string, page: number, size: number, filter: any): Observable<AsyncPage<SurveyEventOverview>> {
        const params = this.getPageParams(page, size, filter);

        return this.http.get<AsyncPage<SurveyEventOverview>>(`${environment.apiUrl}/api/project/${projectCode}/surveyevents`, {params});
    }

    searchSurveyEvents(fishingPoint: number, method: string, occurrenceDate: Date, projectId?: number): Observable<Array<SurveyEvent>> {
        let params = new HttpParams()
            .append('fishingPointId', `${fishingPoint}`)
            .append('date', format(occurrenceDate, 'yyyy-MM-dd'))
            .append('method', method);
        params = projectId ? params.append('projectId', `${projectId}`) : params;

        return this.http.get<Array<SurveyEvent>>(`${environment.apiUrl}/api/surveyevents/search`, {params})
            .pipe(
                map(partialSurveyEvents => partialSurveyEvents
                    .map(surveyEvent => ({
                        ...surveyEvent,
                        surveyEventId: (surveyEvent.surveyEventId as any as { value: number }).value,
                    } as SurveyEvent))),
            );
    }

    getAllSurveyEvents(page: number, size: number, filter: any): Observable<AsyncPage<SurveyEventOverview>> {
        const params = this.getPageParams(page, size, filter);

        return this.http.get<AsyncPage<SurveyEventOverview>>(`${environment.apiUrl}/api/surveyevents`, {params});
    }

    updateSurveyEvent(projectCode: string, surveyEventId: any, formData: any): Observable<SurveyEvent> {
        return this.http.put<SurveyEvent>(`${environment.apiUrl}/api/projects/${projectCode}/surveyevents/${surveyEventId}`,
            formData);
    }

    createSurveyEvent(projectCode: string, formData: any): Observable<SurveyEvent> {
        return this.http.post<SurveyEvent>(`${environment.apiUrl}/api/projects/${projectCode}/surveyevents`, formData);
    }

    reOpenSurveyEvent(projectCode: string, surveyEventId: any): Observable<SurveyEvent> {
        return this.http.post<SurveyEvent>(`${environment.apiUrl}/api/projects/${projectCode}/surveyevents/${surveyEventId}/reopen`, {});
    }

    validateSurveyEvent(projectCode: string, surveyEventId: any): Observable<SurveyEvent> {
        return this.http.post<SurveyEvent>(`${environment.apiUrl}/api/projects/${projectCode}/surveyevents/${surveyEventId}/validate`, {});
    }

    copySurveyEvent(projectCode: string, surveyEventId: any, formData: any): Observable<SurveyEvent> {
        return this.http.post<SurveyEvent>(`${environment.apiUrl}/api/projects/${projectCode}/surveyevents/${surveyEventId}/copy`, formData);
    }

    deleteSurveyEvent(projectCode: string, surveyEventId: any): Observable<void> {
        return this.http.delete<void>(`${environment.apiUrl}/api/projects/${projectCode}/surveyevents/${surveyEventId}`);
    }

    saveMeasurement(projectCode: string, surveyEventId: any, measurementId: any, formData: any): Observable<void> {
        return this.http.put<void>(`${environment.apiUrl}/api/project/${projectCode}/surveyevents/${surveyEventId}/measurements/${measurementId}`, formData);
    }

    getSurveyEvent(projectCode: string, surveyEventId: number): Observable<SurveyEvent> {
        return this.http.get<SurveyEvent>(`${environment.apiUrl}/api/projects/${projectCode}/surveyevents/${surveyEventId}`);
    }

    getMeasurements(projectCode: string, surveyEventId: any, page: number, size: number, sort: string): Observable<AsyncPage<Measurement>> {
        const params = this.getPageParams(page, size, {sort});

        return this.http.get<AsyncPage<Measurement>>(`${environment.apiUrl}/api/project/${projectCode}/surveyevents/${surveyEventId}/measurements`, {params});
    }

    getParameters(projectCode: string, surveyEventId: number): Observable<Parameters> {
        return this.http.get<Parameters>(`${environment.apiUrl}/api/projects/${projectCode}/surveyevents/${surveyEventId}/parameters`);
    }

    listStatusCodes(): Observable<string[]> {
        return this.http.get<string[]>(`${environment.apiUrl}/api/surveyevents/code/status`);
    }

    getHabitat(projectCode: string, surveyEventId: number): Observable<Habitat> {
        return this.http.get<Habitat>(`${environment.apiUrl}/api/projects/${projectCode}/surveyevents/${surveyEventId}/habitat`);
    }

    updateHabitat(projectCode: string, surveyEventId: any, formData: any): Observable<Habitat> {
        return this.http.put<Habitat>(`${environment.apiUrl}/api/projects/${projectCode}/surveyevents/${surveyEventId}/habitat`, formData);
    }

    updateParameters(projectCode: string, surveyEventId: any, formData: any): Observable<Parameters> {
        return this.http.put<Parameters>(`${environment.apiUrl}/api/projects/${projectCode}/surveyevents/${surveyEventId}/parameters`,
            formData);
    }

    createMeasurements(measurements: any, projectCode: string, surveyEventId: any): Observable<void> {
        return this.http.post<void>(
            `${environment.apiUrl}/api/project/${projectCode}/surveyevents/${surveyEventId}/measurements`,
            measurements,
        );
    }

    getAllMeasurementsForSurveyEvent(projectCode: string, surveyEventId: number): Observable<Measurement[]> {
        return this.http.get<Measurement[]>(`${environment.apiUrl}/api/project/${projectCode}/surveyevents/${surveyEventId}/measurements/all`);
    }

    deleteMeasurement(projectCode: string, surveyEventId: number, measurementId: number): Observable<void> {
        return this.http.delete<void>(`${environment.apiUrl}/api/project/${projectCode}/surveyevents/${surveyEventId}/measurements/${measurementId}`);
    }

    surveyEventParameters(projectCode: string, surveyEventId: number): Observable<SurveyEventParameters> {
        return this.http.get<SurveyEventParameters>(`${environment.apiUrl}/api/projects/${projectCode}/surveyevents/${surveyEventId}/cpue/parameters`);
    }

    findTaxaCpueForSurveyEvent(projectCode: string, surveyEventId: number): Observable<TaxonCpue[]> {
        return this.http.get<TaxonCpue[]>(`${environment.apiUrl}/api/projects/${projectCode}/surveyevents/${surveyEventId}/cpue`);
    }

    updateCpueParameters(projectCode: string, surveyEventId: any, formData: any): Observable<boolean> {
        return this.http.put<boolean>(`${environment.apiUrl}/api/projects/${projectCode}/surveyevents/${surveyEventId}/cpue`,
            {parameters: formData});
    }

    recalculateCpue(projectCode: string, surveyEventId: any): Observable<boolean> {
        return this.http.put<boolean>(`${environment.apiUrl}/api/projects/${projectCode}/surveyevents/${surveyEventId}/cpue/recalculate`, {});
    }

    checkIfSurveyEventExists(projectCode: string, location: any, occurrenceDate: any, method: any): Observable<AsyncValidationResult> {
        const params = this.getParams({location, occurrenceDate, method});

        return this.http.get<AsyncValidationResult>(environment.apiUrl + '/api/validation/projects/' + projectCode + '/surveyevents', {params});
    }
}

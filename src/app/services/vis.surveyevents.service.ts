import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AsyncPage} from '../shared-ui/paging-async/asyncPage';
import {Observable} from 'rxjs';
import {Measurement} from '../domain/survey-event/measurement';
import {CpueParameters, SurveyEvent, SurveyEventOverview, SurveyEventId} from '../domain/survey-event/surveyEvent';
import {Parameters} from '../domain/survey-event/parameters';
import {Habitat} from '../domain/survey-event/habitat';
import {VisService} from './vis.service';

@Injectable({
  providedIn: 'root'
})
export class SurveyEventsService extends VisService {

  constructor(private http: HttpClient) {
    super();
  }

  getSurveyEvents(projectCode: string, page: number, size: number, filter: any): Observable<AsyncPage<SurveyEventOverview>> {
    const params = this.getPageParams(page, size, filter);

    return this.http.get<AsyncPage<SurveyEventOverview>>(`${environment.apiUrl}/api/project/${projectCode}/surveyevents`, {params});
  }

  getAllSurveyEvents(page: number, size: number, filter: any): Observable<AsyncPage<SurveyEventOverview>> {
    const params = this.getPageParams(page, size, filter);

    return this.http.get<AsyncPage<SurveyEventOverview>>(`${environment.apiUrl}/api/surveyevents`, {params});
  }

  updateSurveyEvent(projectCode: any, surveyEventId: any, formData: any): Observable<SurveyEvent> {
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

  getMeasurements(projectCode: string, surveyEventId: any, page: number, size: number) {
    const params = this.getPageParams(page, size, null);

    return this.http.get<AsyncPage<Measurement>>(`${environment.apiUrl}/api/project/${projectCode}/surveyevents/${surveyEventId}/measurements`, {params});
  }

  getParameters(projectCode: string, surveyEventId: SurveyEventId) {
    return this.http.get<Parameters>(`${environment.apiUrl}/api/projects/${projectCode}/surveyevents/${surveyEventId}/parameters`);
  }

  listStatusCodes(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/api/surveyevents/code/status`);
  }

  getHabitat(projectCode: string, surveyEventId: SurveyEventId) {
    return this.http.get<Habitat>(`${environment.apiUrl}/api/projects/${projectCode}/surveyevents/${surveyEventId}/habitat`);
  }

  updateHabitat(projectCode: string, surveyEventId: any, formData: any) {
    return this.http.put<Habitat>(`${environment.apiUrl}/api/projects/${projectCode}/surveyevents/${surveyEventId}/habitat`, formData);
  }

  updateParameters(projectCode: string, surveyEventId: any, formData: any) {
    return this.http.put<Parameters>(`${environment.apiUrl}/api/projects/${projectCode}/surveyevents/${surveyEventId}/parameters`,
      formData);
  }

  createMeasurements(measurements: any, projectCode: any, surveyEventId: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/project/${projectCode}/surveyevents/${surveyEventId}/measurements`, measurements);
  }

  getAllMeasurementsForSurveyEvent(projectCode: string, surveyEventId: SurveyEventId) {
    return this.http.get<Measurement[]>(`${environment.apiUrl}/api/project/${projectCode}/surveyevents/${surveyEventId}/measurements/all`);
  }

  deleteMeasurement(projectCode: string, surveyEventId: SurveyEventId, measurementId: number) {
    return this.http.delete<void>(`${environment.apiUrl}/api/project/${projectCode}/surveyevents/${surveyEventId}/measurements/${measurementId}`);
  }

  cpueParameters(projectCode: string, surveyEventId: number): Observable<CpueParameters> {
    return this.http.get<CpueParameters>(`${environment.apiUrl}/api/projects/${projectCode}/surveyevents/${surveyEventId}/cpue`);
  }

  updateCpueParameters(projectCode: any, surveyEventId: any, formData: any) {
    return this.http.put<boolean>(`${environment.apiUrl}/api/projects/${projectCode}/surveyevents/${surveyEventId}/cpue`,
      {parameters: formData});
  }

  recalculateCpue(projectCode: any, surveyEventId: any) {
    return this.http.put<boolean>(`${environment.apiUrl}/api/projects/${projectCode}/surveyevents/${surveyEventId}/cpue/recalculate`, {});
  }
}

import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AsyncPage} from '../shared-ui/paging-async/asyncPage';
import {Observable} from 'rxjs';
import {Measurement} from '../vis/project/model/measurement';
import {SurveyEvent, SurveyEventId} from '../vis/project/model/surveyEvent';
import {Parameters} from '../vis/project/model/parameters';
import {Habitat} from '../vis/survey-events/model/habitat';
import {VisService} from './vis.service';

@Injectable({
  providedIn: 'root'
})
export class SurveyEventsService extends VisService {

  constructor(private http: HttpClient) {
    super();
  }

  getSurveyEvents(projectCode: string, page: number, size: number) {
    const params = this.getPageParams(page, size, null);

    return this.http.get<AsyncPage<SurveyEvent>>(`${environment.apiUrl}/api/project/${projectCode}/surveyevents`, {params});
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

}

import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Project} from '../domain/project/project';
import {AsyncPage} from '../shared-ui/paging-async/asyncPage';
import {Observable, Subject} from 'rxjs';
import {VisService} from './vis.service';
import {Taxon} from '../domain/taxa/taxon';
import {ProjectFavorites} from '../domain/settings/project-favorite';
import {withCache} from '@ngneat/cashew';


@Injectable({
  providedIn: 'root'
})
export class ProjectService extends VisService {

  private projectSubject = new Subject<Project>();

  project$ = this.projectSubject.asObservable();

  constructor(private http: HttpClient) {
    super();
  }

  public downloadFile(res: HttpResponse<Blob>) {
    const contentDisposition = res.headers.get('content-disposition');
    const filename = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim().replace(/\"/g, '');
    const url = window.URL.createObjectURL(res.body);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  }

  next(project: Project): void {
    this.projectSubject.next(project);
  }

  getProjects(page: number, size: number, filter: any) {
    const params = this.getPageParams(page, size, filter);

    return this.http.get<AsyncPage<Project>>(environment.apiUrl + '/api/projects', {params});
  }

  getProject(projectCode: string): Observable<Project> {
    return this.http.get<Project>(`${environment.apiUrl}/api/projects/${projectCode}`);
  }

  getProjectCached(projectCode: string): Observable<Project> {
    return this.http.get<Project>(`${environment.apiUrl}/api/projects/${projectCode}`, {context: withCache()});
  }

  canEdit(projectCode: string): Observable<boolean> {
    return this.http.get<boolean>(`${environment.apiUrl}/api/projects/${projectCode}/canedit`);
  }

  updateProject(code: string, formData: any) {
    return this.http.put<Project>(environment.apiUrl + '/api/projects/' + code, formData);
  }

  createProject(formData: any) {
    return this.http.post(environment.apiUrl + '/api/projects/create', formData);
  }

  checkIfProjectExists(projectCode: any): Observable<any> {
    return this.http.get<any>(environment.apiUrl + '/api/validation/project/code/' + projectCode);
  }

  exportProjects(filter: any) {
    let params = new HttpParams();

    Object.keys(filter).forEach((key) => {
      if (filter[key] !== null) {
        params = params.set(key, filter[key].toString());
      }
    });

    return this.http.get(`${environment.apiUrl}/api/projects/export`, {params, observe: 'response', responseType: 'blob'});
  }

  exportProject(code: string) {
    return this.http.get(`${environment.apiUrl}/api/projects/${code}/export`, {observe: 'response', responseType: 'blob'});
  }

  getProjectTaxa(projectCode: string) {
    return this.http.get<Taxon[]>(`${environment.apiUrl}/api/projects/${projectCode}/taxon`);
  }

  closeProject(projectCode: string, endDate: any) {
    return this.http.post<Project>(`${environment.apiUrl}/api/projects/${projectCode}/close`, endDate);
  }

  reOpenProject(projectCode: string) {
    return this.http.post<Project>(`${environment.apiUrl}/api/projects/${projectCode}/reopen`, {});
  }

  toggleFavorite(projectCode: string) {
    return this.http.post<Project>(`${environment.apiUrl}/api/settings/me/projectfavorites/${projectCode}/togglefavorite`, {});
  }

  projectFavorites(): Observable<ProjectFavorites> {
    return this.http.get<ProjectFavorites>(`${environment.apiUrl}/api/settings/me/projectfavorites`, {});
  }

  projectFavoritesOverview(): Observable<Project[]> {
    return this.http.get<Project[]>(`${environment.apiUrl}/api/projects/favorite`, {});
  }

  getEarliestSurveyEventOccurrenceDate(projectCode: string): Observable<Date> {
    return this.http.get<Date>(`${environment.apiUrl}/api/projects/${projectCode}/surveyevents/earliest`);
  }

  getLatestSurveyEventOccurrenceDate(projectCode: string): Observable<Date> {
    return this.http.get<Date>(`${environment.apiUrl}/api/projects/${projectCode}/surveyevents/latest`);
  }
}

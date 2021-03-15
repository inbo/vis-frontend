import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {environment} from '../environments/environment';
import {Project} from './vis/project/model/project';
import {AsyncPage} from './shared-ui/paging-async/asyncPage';
import {Observable} from 'rxjs';
import {Releases} from './release-notes/model/releases';
import {AlertService} from './_alert';
import {catchError} from 'rxjs/operators';
import {Measurement} from './vis/project/model/measurement';
import {SurveyEvent, SurveyEventId} from './vis/project/model/surveyEvent';
import {Parameters} from './vis/project/model/parameters';
import {Method} from './vis/method/model/method';
import {Taxon} from './vis/fish-specie/model/taxon';
import {TaxonGroup} from './vis/fish-specie/model/taxon-group';
import {TaxonDetail} from './vis/fish-specie/model/taxon-detail';

@Injectable({
  providedIn: 'root'
})
export class VisService {

  constructor(private http: HttpClient, private alertService: AlertService) {
  }

  private downloadFile(res: HttpResponse<Blob>) {
    const contentDisposition = res.headers.get('content-disposition');
    const filename = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim().replace(/\"/g, '');
    const url = window.URL.createObjectURL(res.body);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  }

  private getPageParams(page: number, size: number, filter: any): HttpParams {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    Object.keys(filter ?? []).forEach((key) => {
      if (filter[key] !== null) {
        params = params.set(key, filter[key].toString());
      }
    });
    return params;
  }

  getProjects(page: number, size: number, filter: any) {
    const params = this.getPageParams(page, size, filter);

    return this.http.get<AsyncPage<Project>>(environment.apiUrl + '/api/projects', {params})
      .pipe(catchError(() => {
        this.alertService.unexpectedError();
        return [];
      }));
  }

  getProject(projectCode: string): Observable<Project> {
    return this.http.get<Project>(`${environment.apiUrl}/api/projects/${projectCode}`)
      .pipe(catchError(() => {
        this.alertService.unexpectedError();
        return [];
      }));
  }

  updateProject(code: string, formData: any) {
    return this.http.put(environment.apiUrl + '/api/projects/' + code, formData)
      .pipe(catchError(() => {
        this.alertService.unexpectedError();
        return [];
      }));
  }

  createProject(formData: any) {
    return this.http.post(environment.apiUrl + '/api/projects/create', formData)
      .pipe(catchError(() => {
        this.alertService.unexpectedError();
        return [];
      }));
  }

  checkIfProjectExists(projectCode: any): Observable<any> {
    return this.http.get<any>(environment.apiUrl + '/api/validation/project/code/' + projectCode)
      .pipe(catchError(() => {
        this.alertService.unexpectedError();
        return [];
      }));
  }

  getCurrentRelease() {
    return this.http.get<string>(environment.apiUrl + '/api/releases/current')
      .pipe(catchError(() => {
        return [];
      }));
  }

  getLatestRelease() {
    return this.http.get<string>(environment.apiUrl + '/api/releases/latest')
      .pipe(catchError(() => {
        this.alertService.unexpectedError();
        return [];
      }));
  }

  hasUserReadLatestReleaseNotes() {
    return this.http.get<boolean>(environment.apiUrl + '/api/releases/read')
      .pipe(catchError(() => {
        return [];
      }));
  }

  userReadLatestReleaseNotes() {
    return this.http.post<void>(environment.apiUrl + '/api/releases/read', {})
      .pipe(catchError(() => {
        this.alertService.unexpectedError();
        return [];
      }));
  }

  getReleases(release: any) {
    return this.http.get<Releases>(environment.apiUrl + '/api/releases/' + release)
      .pipe(catchError(() => {
        this.alertService.unexpectedError();
        return [];
      }));
  }

  exportProjects(filter: any) {
    let params = new HttpParams();

    Object.keys(filter).forEach((key) => {
      if (filter[key] !== null) {
        params = params.set(key, filter[key].toString());
      }
    });

    // TODO subscribed is not closed
    this.http.get(`${environment.apiUrl}/api/projects/export`, {params, observe: 'response', responseType: 'blob'})
      .pipe(catchError(() => {
        this.alertService.unexpectedError();
        return [];
      }))
      .subscribe(res => {
        this.downloadFile(res);
      });

  }

  exportProject(code: string) {
    // TODO subscribed is not closed
    this.http.get(`${environment.apiUrl}/api/projects/${code}/export`, {observe: 'response', responseType: 'blob'})
      .pipe(catchError(() => {
        this.alertService.unexpectedError();
        return [];
      }))
      .subscribe(res => {
        this.downloadFile(res);
      });
  }

  getMethods(page: number, size: number, filter: any) {
    const params = this.getPageParams(page, size, filter);

    return this.http.get<AsyncPage<Method>>(environment.apiUrl + '/api/methods', {params})
      .pipe(catchError(() => {
        this.alertService.unexpectedError();
        return [];
      }));

  }

  translations(lang: string) {
    return this.http.get<any>(`${environment.apiUrl}/translations/` + lang);
  }

  getSurveyEvents(projectCode: string, page: number, size: number) {
    const params = this.getPageParams(page, size, null);

    return this.http.get<AsyncPage<SurveyEvent>>(environment.apiUrl + '/api/project/' + projectCode + '/surveyevents', {params})
      .pipe(catchError(() => {
        this.alertService.unexpectedError();
        return [];
      }));
  }

  getMeasurements(projectCode: string, surveyEventId: any, page: number, size: number) {
    const params = this.getPageParams(page, size, null);

    return this.http.get<AsyncPage<Measurement>>(`${environment.apiUrl}/api/project/${projectCode}/surveyevents/${surveyEventId}/measurements`, {params})
      .pipe(catchError(() => {
        this.alertService.unexpectedError();
        return [];
      }));
  }

  getProjectMethods(projectCode: any) {
    return this.http.get<string[]>(`${environment.apiUrl}/api/projects/${projectCode}/methods`)
      .pipe(catchError(() => {
        this.alertService.unexpectedError();
        return [];
      }));
  }

  getAllMethods() {
    return this.http.get<Method[]>(environment.apiUrl + '/api/methods/all')
      .pipe(catchError(() => {
        this.alertService.unexpectedError();
        return [];
      }));
  }

  updateProjectMethods(projectCode: string, methods: string[]) {
    return this.http.post(`${environment.apiUrl}/api/projects/${projectCode}/methods`, methods)
      .pipe(catchError(() => {
        this.alertService.unexpectedError();
        return [];
      }));
  }

  getParameters(projectCode: string, surveyEventId: SurveyEventId) {
    return this.http.get<Parameters>(`${environment.apiUrl}/api/projects/${projectCode}/surveyevents/${surveyEventId}/parameters`)
      .pipe(catchError(() => {
        this.alertService.unexpectedError();
        return [];
      }));
  }

  getTaxa(page: number, size: number, filter: any) {
    const params = this.getPageParams(page, size, filter);

    return this.http.get<AsyncPage<Taxon>>(`${environment.apiUrl}/api/taxon`, {params})
      .pipe(catchError(() => {
        this.alertService.unexpectedError();
        return [];
      }));
  }

  getTaxon(id: number): Observable<TaxonDetail> {
    return this.http.get<TaxonDetail>(`${environment.apiUrl}/api/taxon/${id}`)
      .pipe(catchError(() => {
        this.alertService.unexpectedError();
        return [];
      }));
  }

  getTaxonGroups() {
    return this.http.get<AsyncPage<TaxonGroup>>(`${environment.apiUrl}/api/taxon/groups`)
      .pipe(catchError(() => {
        this.alertService.unexpectedError();
        return [];
      }));
  }

  getHabitat(projectCode: string, surveyEventId: SurveyEventId) {
    return this.http.get<Parameters>(`${environment.apiUrl}/api/projects/${projectCode}/surveyevents/${surveyEventId}/habitat`)
      .pipe(catchError(() => {
        this.alertService.unexpectedError();
        return [];
      }));
  }

  updateHabitat(projectCode: string, surveyEventId: any, formData: any) {
    return this.http.put(`${environment.apiUrl}/api/projects/${projectCode}/surveyevents/${surveyEventId}/habitat`, formData)
      .pipe(catchError(() => {
        this.alertService.unexpectedError();
        return [];
      }));
  }

  updateParameters(projectCode: string, surveyEventId: any, formData: any) {
    return this.http.put(`${environment.apiUrl}/api/projects/${projectCode}/surveyevents/${surveyEventId}/parameters`, formData)
      .pipe(catchError(() => {
        this.alertService.unexpectedError();
        return [];
      }));
  }

}

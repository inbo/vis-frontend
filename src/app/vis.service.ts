import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {environment} from '../environments/environment';
import {Project} from './vis/project/model/project';
import {AsyncPage} from './shared-ui/paging-async/asyncPage';
import {Observable, Subscription} from 'rxjs';
import {Releases} from './release-notes/model/releases';
import {Measurement} from './vis/project/model/measurement';
import {SurveyEvent, SurveyEventId} from './vis/project/model/surveyEvent';
import {Parameters} from './vis/project/model/parameters';
import {Method} from './vis/method/model/method';
import {Taxon} from './vis/fish-specie/model/taxon';
import {TaxonGroup} from './vis/fish-specie/model/taxon-group';
import {TaxonDetail} from './vis/fish-specie/model/taxon-detail';
import {Habitat} from './vis/survey-events/model/habitat';
import {Tip} from "./vis/project/model/tip";

@Injectable({
  providedIn: 'root'
})
export class VisService implements OnDestroy {

  private subscription = new Subscription();

  constructor(private http: HttpClient) {
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

    return this.http.get<AsyncPage<Project>>(environment.apiUrl + '/api/projects', {params});
  }

  getProject(projectCode: string): Observable<Project> {
    return this.http.get<Project>(`${environment.apiUrl}/api/projects/${projectCode}`);
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

  getCurrentRelease() {
    return this.http.get<string>(environment.apiUrl + '/api/releases/current');
  }

  getLatestRelease() {
    return this.http.get<string>(environment.apiUrl + '/api/releases/latest');
  }

  hasUserReadLatestReleaseNotes() {
    return this.http.get<boolean>(environment.apiUrl + '/api/releases/read');
  }

  userReadLatestReleaseNotes() {
    return this.http.post<void>(environment.apiUrl + '/api/releases/read', {});
  }

  getReleases(release: any) {
    return this.http.get<Releases>(environment.apiUrl + '/api/releases/' + release);
  }

  exportProjects(filter: any) {
    let params = new HttpParams();

    Object.keys(filter).forEach((key) => {
      if (filter[key] !== null) {
        params = params.set(key, filter[key].toString());
      }
    });

    this.subscription.add(this.http.get(`${environment.apiUrl}/api/projects/export`, {params, observe: 'response', responseType: 'blob'})
      .subscribe(res => {
        this.downloadFile(res);
      }));
  }

  exportProject(code: string) {
    this.subscription.add(this.http.get(`${environment.apiUrl}/api/projects/${code}/export`, {observe: 'response', responseType: 'blob'})
      .subscribe(res => {
        this.downloadFile(res);
      }));
  }

  getMethods(page: number, size: number, filter: any) {
    const params = this.getPageParams(page, size, filter);

    return this.http.get<AsyncPage<Method>>(environment.apiUrl + '/api/methods', {params});

  }

  translations(lang: string) {
    return this.http.get<any>(`${environment.apiUrl}/translations/` + lang);
  }

  getSurveyEvents(projectCode: string, page: number, size: number) {
    const params = this.getPageParams(page, size, null);

    return this.http.get<AsyncPage<SurveyEvent>>(environment.apiUrl + '/api/project/' + projectCode + '/surveyevents', {params});
  }

  getSurveyEvent(projectCode: string, surveyEventId: number): Observable<SurveyEvent> {
    return this.http.get<SurveyEvent>(`${environment.apiUrl}/api/projects/${projectCode}/surveyevents/${surveyEventId}`);
  }

  getMeasurements(projectCode: string, surveyEventId: any, page: number, size: number) {
    const params = this.getPageParams(page, size, null);

    return this.http.get<AsyncPage<Measurement>>(`${environment.apiUrl}/api/project/${projectCode}/surveyevents/${surveyEventId}/measurements`, {params});
  }

  getProjectMethods(projectCode: any) {
    return this.http.get<string[]>(`${environment.apiUrl}/api/projects/${projectCode}/methods`);
  }

  getAllMethods() {
    return this.http.get<Method[]>(environment.apiUrl + '/api/methods/all');
  }

  updateProjectMethods(projectCode: string, methods: string[]) {
    return this.http.post<string[]>(`${environment.apiUrl}/api/projects/${projectCode}/methods`, methods);
  }

  getParameters(projectCode: string, surveyEventId: SurveyEventId) {
    return this.http.get<Parameters>(`${environment.apiUrl}/api/projects/${projectCode}/surveyevents/${surveyEventId}/parameters`);
  }

  getTaxa(val: string) {
    const params = new HttpParams()
      .set('nameDutch', val)
      .set('nameScientific', val)
      .set('taxonCode', val);

    return this.http.get<Taxon[]>(`${environment.apiUrl}/api/taxon`, {params});
  }

  getFilteredTaxa(page: number, size: number, filter: any) {
    const params = this.getPageParams(page, size, filter);

    return this.http.get<AsyncPage<Taxon>>(`${environment.apiUrl}/api/taxon/search`, {params});
  }

  getTaxon(id: number): Observable<TaxonDetail> {
    return this.http.get<TaxonDetail>(`${environment.apiUrl}/api/taxon/${id}`);
  }

  getTaxonGroups() {
    return this.http.get<AsyncPage<TaxonGroup>>(`${environment.apiUrl}/api/taxon/groups`);
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

  getTip(code: string): Observable<Tip> {
    return this.http.get<Tip>(`${environment.apiUrl}/api/tips/${code}`);
  }

  markTipAsRead(code: string) {
    return this.http.post<Tip>(`${environment.apiUrl}/api/tips/${code}/read`, '');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  createMeasurements(measurements: any, projectCode: any, surveyEventId: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/project/${projectCode}/surveyevents/${surveyEventId}/measurements`, measurements);
  }
}

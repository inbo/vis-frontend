import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {environment} from '../environments/environment';
import {Project} from "./project/model/project";
import {AsyncPage} from "./shared-ui/paging-async/asyncPage";
import {Observable} from "rxjs";
import {Releases} from './release-notes/model/releases';
import {AlertService} from "./_alert";
import {catchError} from "rxjs/operators";
import {Measurement} from "./project/model/measurement";
import {Observation, ObservationId} from "./project/model/observation";
import {Parameters} from "./project/model/parameters";
import {Taxon} from './fish-specie/model/taxon';
import {TaxonGroup} from './fish-specie/model/taxon-group';

@Injectable({
  providedIn: 'root'
})
export class VisService {

  constructor(private http: HttpClient, private alertService: AlertService) {
  }

  getProjects(page: number, size: number, filter: any) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    Object.keys(filter).forEach(function (key, index) {
      if (filter[key] !== null) {
        params = params.set(key, filter[key].toString())
      }
    });

    return this.http.get<AsyncPage<Project>>(environment.apiUrl + '/api/projects', {params})
      .pipe(catchError(err => {
        this.alertService.unexpectedError();
        return [];
      }));
  }

  getProject(projectCode: string) {
    return this.http.get<Project>(environment.apiUrl + '/api/project/' + projectCode)
      .pipe(catchError(err => {
        this.alertService.unexpectedError();
        return []
      }));
  }

  updateProject(code: string, formData: Object) {
    return this.http.put(environment.apiUrl + '/api/project/' + code, formData)
      .pipe(catchError(err => {
        this.alertService.unexpectedError();
        return []
      }));
  }

  createProject(formData: Object) {
    return this.http.post(environment.apiUrl + '/api/projects/create', formData)
      .pipe(catchError(err => {
        this.alertService.unexpectedError();
        return []
      }));
  }

  checkIfProjectExists(projectCode: any): Observable<any> {
    return this.http.get<any>(environment.apiUrl + '/api/validation/project/code/' + projectCode)
      .pipe(catchError(err => {
        this.alertService.unexpectedError();
        return []
      }));
  }

  getCurrentRelease() {
    return this.http.get<string>(environment.apiUrl + '/api/releases/current')
      .pipe(catchError(err => {
        return []
      }));
  }

  getLatestRelease() {
    return this.http.get<string>(environment.apiUrl + '/api/releases/latest')
      .pipe(catchError(err => {
        this.alertService.unexpectedError();
        return []
      }));
  }

  hasUserReadLatestReleaseNotes() {
    return this.http.get<boolean>(environment.apiUrl + '/api/releases/read')
      .pipe(catchError(err => {
        return []
      }));
  }

  userReadLatestReleaseNotes() {
    return this.http.post<void>(environment.apiUrl + '/api/releases/read', {})
      .pipe(catchError(err => {
        this.alertService.unexpectedError();
        return []
      }));
  }

  getReleases(release: any) {
    return this.http.get<Releases>(environment.apiUrl + '/api/releases/' + release)
      .pipe(catchError(err => {
        this.alertService.unexpectedError();
        return []
      }));
  }

  exportProjects(filter: any) {
    let params = new HttpParams()

    Object.keys(filter).forEach(function (key, index) {
      if (filter[key] !== null) {
        params = params.set(key, filter[key].toString())
      }
    });

    this.http.get(`${environment.apiUrl}/api/projects/export`, {params, observe: 'response', responseType: 'blob'})
      .pipe(catchError(err => {
        this.alertService.unexpectedError();
        return []
      }))
      .subscribe(res => {
        this.downloadFile(res)
      })

  }

  exportProject(code: String) {
    this.http.get(`${environment.apiUrl}/api/projects/${code}/export`, {observe: 'response', responseType: 'blob'})
      .pipe(catchError(err => {
        this.alertService.unexpectedError();
        return []
      }))
      .subscribe(res => {
        this.downloadFile(res)
      });
  }

  getMethods(page: number, size: number, filter: any) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    Object.keys(filter).forEach(function (key, index) {
      if (filter[key] !== null) {
        params = params.set(key, filter[key].toString())
      }
    });

    return this.http.get<AsyncPage<Project>>(environment.apiUrl + '/api/methods', {params})
      .pipe(catchError(err => {
        this.alertService.unexpectedError();
        return [];
      }));

  }

  translations(lang: string) {
    return this.http.get<any>(`${environment.apiUrl}/translations/` + lang);
  }

  private downloadFile(res: HttpResponse<Blob>) {
    const contentDisposition = res.headers.get('content-disposition');
    const filename = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim().replace(/\"/g, '');
    let url = window.URL.createObjectURL(res.body);
    let link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  }

  getObservations(projectCode: string, page: number, size: number) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<AsyncPage<Observation>>(environment.apiUrl + '/api/project/' + projectCode + "/observations", {params})
      .pipe(catchError(err => {
        this.alertService.unexpectedError();
        return [];
      }));
  }

  getMeasurements(projectCode: string, observationId: any, page: number, size: number) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<AsyncPage<Measurement>>(`${environment.apiUrl}/api/project/${projectCode}/observations/${observationId}/measurements`, {params})
      .pipe(catchError(err => {
        this.alertService.unexpectedError();
        return [];
      }));
  }

  getParameters(projectCode: string, observationId: ObservationId) {
    return this.http.get<Parameters>(`${environment.apiUrl}/api/projects/${projectCode}/observations/${observationId}/parameters`)
      .pipe(catchError(err => {
        this.alertService.unexpectedError();
        return [];
      }));
  }

  getTaxon(page: number, size: number, filter: any) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    Object.keys(filter).forEach(function (key, index) {
      if (filter[key] !== null) {
        params = params.set(key, filter[key].toString())
      }
    });

    return this.http.get<AsyncPage<Taxon>>(environment.apiUrl + '/api/taxon', {params})
      .pipe(catchError(err => {
        this.alertService.unexpectedError();
        return [];
      }));
  }

  getTaxonGroups() {
    return this.http.get<AsyncPage<TaxonGroup>>(environment.apiUrl + '/api/taxon/groups')
      .pipe(catchError(err => {
        this.alertService.unexpectedError();
        return [];
      }));
  }
}

import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../environments/environment';
import {Project} from "./project/model/project";
import {AsyncPage} from "./shared-ui/paging-async/asyncPage";
import {Observable} from "rxjs";
import {Releases} from './release-notes/model/releases';

@Injectable({
  providedIn: 'root'
})
export class VisService {

  constructor(private http: HttpClient) {
  }

  getProjects(page: number, size: number) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', size.toString());

    return this.http.get<AsyncPage<Project>>(environment.apiUrl + '/api/projects', {params});
  }

  getProject(projectCode: string) {
    return this.http.get<Project>(environment.apiUrl + '/api/project/' + projectCode);
  }

  updateProject(code: string, formData: Object) {
    return this.http.put(environment.apiUrl + '/api/project/' + code, formData);
  }

  createProject(formData: Object) {
    return this.http.post(environment.apiUrl + '/api/projects/create', formData);
  }

  checkIfProjectExists(projectCode: any) : Observable<any> {
    return this.http.get<any>(environment.apiUrl + '/api/validation/project/code/' + projectCode)
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
}

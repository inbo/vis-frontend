import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../environments/environment';
import {Project} from "./project/model/project";
import {AsyncPage} from "./shared-ui/paging-async/asyncPage";
import {Observable} from "rxjs";

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
    return this.http.get<Project>(environment.apiUrl + '/api/project/' + projectCode)
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
}

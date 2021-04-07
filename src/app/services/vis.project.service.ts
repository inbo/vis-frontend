import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Project} from '../domain/project/project';
import {AsyncPage} from '../shared-ui/paging-async/asyncPage';
import {Observable, Subscription} from 'rxjs';
import {VisService} from './vis.service';
import {Taxon} from '../domain/taxa/taxon';

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends VisService implements OnDestroy {

  // TODO in een service zouden geen subscribes mogen zitten
  private subscription = new Subscription();

  constructor(private http: HttpClient) {
    super();
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

  getProjectMethods(projectCode: any) {
    return this.http.get<string[]>(`${environment.apiUrl}/api/projects/${projectCode}/methods`);
  }

  updateProjectMethods(projectCode: string, methods: string[]) {
    return this.http.post<string[]>(`${environment.apiUrl}/api/projects/${projectCode}/methods`, methods);
  }

  getProjectTaxa(projectCode: string) {
    return this.http.get<Taxon[]>(`${environment.apiUrl}/api/projects/${projectCode}/taxon`);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  closeProject(projectCode: string, endDate: any) {
    return this.http.post(`${environment.apiUrl}/api/projects/${projectCode}/close`, endDate);
  }
}

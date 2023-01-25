import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AsyncPage} from '../shared-ui/paging-async/asyncPage';
import {VisService} from './vis.service';
import {MethodGroup} from '../domain/method/method-group';
import {Method} from '../domain/method/method';
import {Observable} from 'rxjs';
import {withCache} from '@ngneat/cashew';

@Injectable({
  providedIn: 'root'
})
export class MethodsService extends VisService {

  constructor(private http: HttpClient) {
    super();
  }

  getMethods(page: number, size: number, filter: any) {
    const params = this.getPageParams(page, size, filter);

    return this.http.get<AsyncPage<Method>>(environment.apiUrl + '/api/methods', {params, context: withCache()});

  }

  getAllMethods(): Observable<Method[]> {
    return this.http.get<Method[]>(environment.apiUrl + '/api/methods/all', {context: withCache()});
  }

  getAllMethodsForProject(projectCode): Observable<Method[]> {
    return this.http.get<Method[]>(`${environment.apiUrl}/api/methods/project/${projectCode}`);
  }

  updateProjectMethods(projectCode: string, methods: string[]) {
    return this.http.post<string[]>(`${environment.apiUrl}/api/projects/${projectCode}/methods`, methods);
  }

  getAllMethodGroups() {
    return this.http.get<MethodGroup[]>(environment.apiUrl + '/api/method-groups/all', {context: withCache()});
  }

  getMethodsForGroup(group: string) {
    const params = new HttpParams()
      .set('methodGroup', group);
    return this.http.get<Method[]>(`${environment.apiUrl}/api/method-groups/methods`, {params, context: withCache()});
  }

  getMethod(methodCode: string): Observable<Method> {
    return this.http.get<Method>(`${environment.apiUrl}/api/methods/${methodCode}`);
  }

  updateMethod(formData: any, methodCode: string) {
    return this.http.put<Method>(`${environment.apiUrl}/api/methods/${methodCode}`, formData);

  }
}

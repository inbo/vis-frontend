import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AsyncPage} from '../shared-ui/paging-async/asyncPage';
import {VisService} from './vis.service';
import {MethodGroup} from '../domain/method/method-group';
import {Method} from '../domain/method/method';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MethodsService extends VisService {

  constructor(private http: HttpClient) {
    super();
  }

  getMethods(page: number, size: number, filter: any) {
    const params = this.getPageParams(page, size, filter);

    return this.http.get<AsyncPage<Method>>(environment.apiUrl + '/api/methods', {params});

  }

  getAllMethods(): Observable<Method[]> {
    return this.http.get<Method[]>(environment.apiUrl + '/api/methods/all');
  }

  updateProjectMethods(projectCode: string, methods: string[]) {
    return this.http.post<string[]>(`${environment.apiUrl}/api/projects/${projectCode}/methods`, methods);
  }

  getAllMethodGroups() {
    return this.http.get<MethodGroup[]>(environment.apiUrl + '/api/method-groups/all');
  }

  getMethodsForGroup(group: string) {
    const params = new HttpParams()
      .set('methodGroup', group);
    return this.http.get<Method[]>(`${environment.apiUrl}/api/method-groups/methods`, {params});
  }
}

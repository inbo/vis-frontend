import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AsyncPage} from '../shared-ui/paging-async/asyncPage';
import {Method} from '../vis/method/model/method';
import {VisService} from './vis.service';

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

  getAllMethods() {
    return this.http.get<Method[]>(environment.apiUrl + '/api/methods/all');
  }

  updateProjectMethods(projectCode: string, methods: string[]) {
    return this.http.post<string[]>(`${environment.apiUrl}/api/projects/${projectCode}/methods`, methods);
  }
}

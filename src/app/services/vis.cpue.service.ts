import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {VisService} from './vis.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CpueService extends VisService {

  constructor(private http: HttpClient) {
    super();
  }

  cpueParametersByMethodCode(methodCode: string): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/api/methods/${methodCode}/cpue`);
  }

  listAllParameters() {
    return this.http.get<string[]>(`${environment.apiUrl}/api/cpue/parameters`);
  }

  testCalculation(formData: any) {
    return this.http.put<number>(`${environment.apiUrl}/api/cpue/calculate/test`, formData);
  }
}

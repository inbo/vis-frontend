import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {Tip} from '../domain/tip/tip';
import {VisService} from './vis.service';

@Injectable({
  providedIn: 'root'
})
export class TipsService extends VisService {

  constructor(private http: HttpClient) {
    super();
  }

  getTip(code: string): Observable<Tip> {
    return this.http.get<Tip>(`${environment.apiUrl}/api/tips/${code}`);
  }

  randomTipForPage(page: string): Observable<Tip> {
    return this.http.get<Tip>(`${environment.apiUrl}/api/tips/random/${page}`);
  }

  markTipAsRead(code: string) {
    return this.http.post<Tip>(`${environment.apiUrl}/api/tips/${code}/read`, '');
  }

}

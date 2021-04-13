import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {VisService} from './vis.service';
import {ServerAlert} from '../domain/alert/server.alert';

@Injectable({
  providedIn: 'root'
})
export class ServerAlertService extends VisService {

  constructor(private http: HttpClient) {
    super();
  }

  getCurrentAlerts(): Observable<ServerAlert[]> {
    return this.http.get<ServerAlert[]>(`${environment.apiUrl}/api/alerts/current`);
  }
}

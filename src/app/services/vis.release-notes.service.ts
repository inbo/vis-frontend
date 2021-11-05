import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Releases} from '../release-notes/model/releases';
import {VisService} from './vis.service';
import {InterceptorSkipHeader} from '../core/http.error.interceptor';

@Injectable({
  providedIn: 'root'
})
export class ReleaseNotesService extends VisService {

  constructor(private http: HttpClient) {
    super();
  }

  getCurrentRelease() {
    return this.http.get<string>(environment.apiUrl + '/api/releases/current', {headers: InterceptorSkipHeader});
  }

  getLatestRelease() {
    return this.http.get<string>(environment.apiUrl + '/api/releases/latest', {headers: InterceptorSkipHeader});
  }

  hasUserReadLatestReleaseNotes() {
    return this.http.get<boolean>(environment.apiUrl + '/api/releases/read', {headers: InterceptorSkipHeader});
  }

  userReadLatestReleaseNotes() {
    return this.http.post<void>(environment.apiUrl + '/api/releases/read', {}, {headers: InterceptorSkipHeader});
  }

  getReleases(release: any) {
    return this.http.get<Releases>(environment.apiUrl + '/api/releases/' + release);
  }
}

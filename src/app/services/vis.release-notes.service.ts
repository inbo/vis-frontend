import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Releases} from '../release-notes/model/releases';
import {VisService} from './vis.service';

@Injectable({
  providedIn: 'root'
})
export class ReleaseNotesService extends VisService {

  constructor(private http: HttpClient) {
    super();
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

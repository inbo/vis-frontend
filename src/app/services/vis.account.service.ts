import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {VisService} from './vis.service';
import {Account} from '../domain/account/account';
import {AsyncPage} from '../shared-ui/paging-async/asyncPage';
import {Observable} from 'rxjs';
import {Team} from '../domain/account/team';

@Injectable({
  providedIn: 'root'
})
export class AccountService extends VisService {

  constructor(private http: HttpClient) {
    super();
  }

  registerAccount() {
    return this.http.post<string>(environment.apiUrl + '/api/account/register', {});
  }

  listAccounts(page: number, size: number, filter: any): Observable<AsyncPage<Account>> {
    const params = this.getPageParams(page, size, filter);

    return this.http.get<AsyncPage<Account>>(environment.apiUrl + '/api/accounts', {params});
  }

  listTeams() {
    return this.http.get<Team[]>(environment.apiUrl + '/api/teams', {});
  }

  updateTeam(username: string, team: any) {
    return this.http.patch<void>(environment.apiUrl + '/api/account/' + username + '/team', team);
  }

  getAccounts(val: string) {
    const params = new HttpParams()
      .set('name', val);

    return this.http.get<Account[]>(`${environment.apiUrl}/api/accounts/search`, {params});
  }
}

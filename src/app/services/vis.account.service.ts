import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {VisService} from './vis.service';
import {Account} from '../domain/account/account';
import {AsyncPage} from '../shared-ui/paging-async/asyncPage';
import {Observable} from 'rxjs';

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

}

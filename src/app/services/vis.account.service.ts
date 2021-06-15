import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {VisService} from './vis.service';

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

}

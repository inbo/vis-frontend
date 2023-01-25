import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {VisService} from './vis.service';
import {Account} from '../domain/account/account';
import {AsyncPage} from '../shared-ui/paging-async/asyncPage';
import {Observable, of} from 'rxjs';
import {Team} from '../domain/account/team';
import {Instance} from '../domain/account/instance';
import {AsyncValidationResult} from './validation';
import {InterceptorSkipHeader} from '../core/http.error.interceptor';
import {AuthService} from '../core/auth.service';

@Injectable({
    providedIn: 'root',
})
export class AccountService extends VisService {

    readonly registrationKey = 'inbo_registered';
    readonly registeredEmailsSeparator = ';';

    constructor(private http: HttpClient,
                private authService: AuthService) {
        super();
    }

    registerAccount(): Observable<void> {
        const registeredAccounts = localStorage.getItem(this.registrationKey)?.split(this.registeredEmailsSeparator) || [];
        if (registeredAccounts.includes(this.authService.email)) {
            return of(undefined);
        }
        localStorage.setItem(this.registrationKey, [...registeredAccounts, this.authService.email].join(this.registeredEmailsSeparator));
        return this.http.post<void>(environment.apiUrl + '/api/accounts/register', {}, {headers: InterceptorSkipHeader});
    }

    update(username: string, body: any): Observable<void> {
        return this.http.patch<void>(`${environment.apiUrl}/api/accounts/${username}`, body);
    }

    listAccounts(page: number, size: number, filter: any): Observable<AsyncPage<Account>> {
        const params = this.getPageParams(page, size, filter);

        return this.http.get<AsyncPage<Account>>(environment.apiUrl + '/api/accounts', {params});
    }

    getAccounts(val: string): Observable<Account[]> {
        const params = new HttpParams()
            .set('name', val);

        return this.http.get<Account[]>(`${environment.apiUrl}/api/accounts/search`, {params});
    }

    listTeams(): Observable<Team[]> {
        return this.http.get<Team[]>(environment.apiUrl + '/api/teams/all', {});
    }

    addTeam(team: any): Observable<void> {
        return this.http.post<void>(`${environment.apiUrl}/api/teams`, team);
    }

    checkIfTeamExists(teamCode: any): Observable<AsyncValidationResult> {
        return this.http.get<AsyncValidationResult>(environment.apiUrl + '/api/validation/teams/code/' + teamCode);
    }

    getTeams(page: number, size: number): Observable<AsyncPage<Team>> {
        const params = this.getPageParams(page, size, null);

        return this.http.get<AsyncPage<Team>>(environment.apiUrl + '/api/teams', {params});
    }

    editTeam(code: string, rawValue: any): Observable<void> {
        return this.http.put<void>(`${environment.apiUrl}/api/teams/${code}`, rawValue);
    }

    listAccountsForTeam(code: string): Observable<Account[]> {
        return this.http.get<Account[]>(`${environment.apiUrl}/api/teams/${code}/accounts`, {});
    }

    listInstances(): Observable<Instance[]> {
        return this.http.get<Instance[]>(`${environment.apiUrl}/api/instances/all`, {});
    }

    getInstances(page: number, size: number): Observable<AsyncPage<Team>> {
        const params = this.getPageParams(page, size, null);

        return this.http.get<AsyncPage<Team>>(environment.apiUrl + '/api/instances', {params});
    }

    addInstance(instance: any): Observable<void> {
        return this.http.post<void>(`${environment.apiUrl}/api/instances`, instance);
    }
}

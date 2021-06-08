import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {filter, map} from 'rxjs/operators';

import {AuthService} from './auth.service';

@Injectable()
export class AuthGuardRole implements CanActivate {
  constructor(private authService: AuthService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.isDoneLoading$.pipe(
      filter(isDone => isDone),
      map(_ => this.authService.hasRole(route.data.role))
    );
  }
}

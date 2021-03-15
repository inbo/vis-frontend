import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {filter, switchMap, tap} from 'rxjs/operators';

import {AuthService} from './auth.service';
import {Role} from "./_models/role";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let roles = route.data.roles as Role[];

    for (let neededRole of roles) {
      if (this.authService.clientRoles.indexOf(neededRole) >= 0) {
        return true;
      }
    }

    //TODO redirect to an error page?
    return false;

  }
}

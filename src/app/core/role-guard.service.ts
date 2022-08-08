import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from './auth.service';
import {Role} from './_models/role';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const roles = route.data.roles as Role[];

    for (const neededRole of roles) {
      if (this.authService.clientRoles.indexOf(neededRole) >= 0) {
        return true;
      }
    }

    this.router.navigateByUrl('/forbidden');
    return false;
  }
}

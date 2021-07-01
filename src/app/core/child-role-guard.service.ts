import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from './auth.service';
import {Role} from './_models/role';

@Injectable()
export class ChildRoleGuard implements CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const roles = childRoute.parent.data.roles as Role[];

    for (const neededRole of roles) {
      if (this.authService.clientRoles.indexOf(neededRole) >= 0) {
        return true;
      }
    }

    this.router.navigateByUrl('/forbidden').then();
    return false;
  }
}

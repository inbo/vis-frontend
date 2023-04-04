import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {ProjectService} from '../services/vis.project.service';
import {lastValueFrom} from 'rxjs';

@Injectable()
export class ProjectEditGuard implements CanActivate {
  constructor(private projectService: ProjectService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return lastValueFrom(this.projectService.canEdit(this.getProjectCode(route)));
  }

  private getProjectCode(route: ActivatedRouteSnapshot) {
    let next = route;
    do {
      const projectCode = next.params.projectCode;
      if (projectCode) {
        return projectCode;
      }
      next = next.parent;
    } while (next);
    return null;
  }
}

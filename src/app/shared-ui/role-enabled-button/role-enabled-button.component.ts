import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {AuthService} from '../../core/auth.service';
import {Role} from '../../core/_models/role';
import {Router} from '@angular/router';
import {ProjectCode} from '../../domain/project/project';
import {ProjectService} from '../../services/vis.project.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-button',
  templateUrl: './role-enabled-button.component.html'
})
export class RoleEnabledButtonComponent implements OnInit, OnDestroy, OnChanges {

  @Input()
  role: Role;

  @Input()
  projectCode: ProjectCode;

  @Input()
  isUserLinkedToProject: boolean;

  @Input()
  style: string;

  @Input()
  routerLink: any[] | string | null | undefined;

  @Input()
  disabled: boolean;

  @Input()
  disabledReason: string;

  primaryStyle = 'inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500';
  secondaryStyle = 'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-pink-700 bg-pink-100 hover:bg-pink-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500';
  whiteStyle = 'inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500';


  private subscription = new Subscription();

  constructor(public authService: AuthService, private router: Router, private projectService: ProjectService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.projectCode) {
      this.subscription.add(
        this.projectService.canEdit(this.projectCode.value).subscribe(value => this.isUserLinkedToProject = value)
      );
    }
  }

  usedStyle(): string {
    switch (this.style) {
      case 'primary':
        return this.primaryStyle;
      case 'secondary':
        return this.secondaryStyle;
      case 'white':
        return this.whiteStyle;
      case 'no-style':
        return '';
      default:
        return this.whiteStyle;
    }
  }

  isDisabled() {
    if (this.role === undefined && this.disabled === undefined && this.isUserLinkedToProject === undefined) {
      return false;
    }
    const isDisabled = this.disabled === undefined ? false : this.disabled;
    const hasRole = this.hasRole();
    const hasProjectRights = this.isUserLinkedToProject === undefined ? false: this.isUserLinkedToProject;

    return isDisabled || !hasRole || !hasProjectRights;
  }

  private hasRole() {
    return this.role !== undefined ? this.authService.hasRole(this.role) : true;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  title() {
    if (this.disabled) {
      return this.disabledReason ? this.disabledReason : null;
    }

    if (!this.isUserLinkedToProject) {
      return 'Je ben niet gekoppeld aan de juiste instantie/team om deze actie te kunnen doen';
    }

    return !this.hasRole() ? 'Je beschikt niet over de nodige rechten' : null;
  }
}

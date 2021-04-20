import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../core/auth.service';
import {Role} from '../../core/_models/role';
import {Router} from '@angular/router';

@Component({
  selector: 'app-button',
  templateUrl: './role-enabled-button.component.html'
})
export class RoleEnabledButtonComponent implements OnInit {

  @Input()
  role: Role;

  @Input()
  style: string;

  @Input()
  routerLink: any[] | string | null | undefined;

  @Input()
  valid = true;

  @Input()
  disabled = false;

  primaryStyle = 'inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500';
  secondaryStyle = 'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-pink-700 bg-pink-100 hover:bg-pink-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500';
  whiteStyle = 'inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500';

  constructor(public authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
  }

  usedStyle(): string {
    switch (this.style) {
      case 'primary':
        return this.primaryStyle;
      case 'secondary':
        return this.secondaryStyle;
      case 'white':
        return this.whiteStyle;
      default:
        return this.whiteStyle;
    }
  }

  route() {
    let commands = [];
    if (this.routerLink) {
      commands = Array.isArray(this.routerLink) ? this.routerLink : [this.routerLink];
      this.router.navigateByUrl(this.router.createUrlTree(commands)).then();
    }
  }
}

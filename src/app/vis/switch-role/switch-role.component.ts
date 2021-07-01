import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../core/auth.service';
import {Role} from '../../core/_models/role';

@Component({
  selector: 'app-switch-role',
  templateUrl: './switch-role.component.html'
})
export class SwitchRoleComponent implements OnInit {

  public roleValues = Object.values(Role);
  isOpen = false;
  private roles: Role[];

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.roles = this.authService.clientRoles;
  }

  cancel() {
    this.isOpen = false;
  }

  changeUse($event: Event) {
    const isChecked = ($event.target as HTMLInputElement).checked;

    this.authService.changeDummyRolesUse(isChecked);
  }

  isUsedForDummyRoles(): boolean {
    return localStorage.getItem('useDummyRoles') === 'true';
  }

  changeRole(role: string, $event: Event) {
    const isChecked = ($event.target as HTMLInputElement).checked;

    this.authService.changeDummyRoleStatus(role, isChecked);

  }

  isActive(value: string): boolean {
    let roles = localStorage.getItem('roles');
    if (roles === null) {
      roles = '';
    }

    return roles
      .split(',')
      .indexOf(value) >= 0;
  }
}

import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../core/auth.service";
import {Role} from "../../core/_models/role";

@Component({
  selector: 'app-switch-role',
  templateUrl: './switch-role.component.html'
})
export class SwitchRoleComponent implements OnInit {

  public roleValues = Object.values(Role);
  isOpen: boolean = false;
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
    let isChecked = ($event.target as HTMLInputElement).checked;

    if (isChecked) {
      localStorage.setItem("useDummyRoles", 'true');
    } else {
      localStorage.setItem("useDummyRoles", 'false')
    }
  }

  isUsedForDummyRoles(): boolean {
    return localStorage.getItem("useDummyRoles") === 'true'
  }

  changeRole(role: string, $event: Event) {
    let isChecked = ($event.target as HTMLInputElement).checked;

    let roles = localStorage.getItem("roles");
    if (roles === null) {
      roles = "";
    }

    if (isChecked) {
      let newRoles = roles
        .split(',')
        .filter(value => value !== role);
      newRoles.push(role);
      localStorage.setItem("roles", newRoles.join(","));
    } else {
      let newRoles = roles
        .split(',')
        .filter(value => value !== role);
      localStorage.setItem("roles", newRoles.join(","))
    }

  }

  isActive(value: string): boolean {
    let roles = localStorage.getItem("roles");
    if (roles === null) {
      roles = "";
    }

    return roles
      .split(',')
      .indexOf(value) >= 0;
  }
}

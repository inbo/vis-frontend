import {Component, Input, OnInit} from '@angular/core';
import {NavigationLink} from "../NavigationLinks";
import {AuthService} from "../../../core/auth.service";

@Component({
  selector: 'stacked-layout',
  templateUrl: './stacked-layout.component.html'
})
export class StackedLayoutComponent implements OnInit {

  @Input() navigationLinks: NavigationLink[];

  public isOpen: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  logout() {
    this.authService.logout();
  }

  public get fullName() {
    return this.authService.fullName
  }

  public get username() {
    return this.authService.username
  }

  public get picture() {
    return this.authService.picture
  }
}

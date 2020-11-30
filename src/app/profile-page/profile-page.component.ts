import { Component, OnInit } from '@angular/core';
import {NavigationLink} from "../shared-ui/layouts/NavigationLinks";
import {GlobalConstants} from "../GlobalConstants";
import {BreadcrumbLink} from "../shared-ui/breadcrumb/BreadcrumbLinks";
import {Title} from "@angular/platform-browser";
import {AuthService} from "../core/auth.service";

@Component({
  selector: 'profile-page',
  templateUrl: './profile-page.component.html'
})
export class ProfilePageComponent implements OnInit {

  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Mijn profiel', url: '/profiel'},
  ]

  constructor(private titleService: Title, private authService: AuthService) {
    this.titleService.setTitle("Mijn V.I.S profiel")
  }

  ngOnInit(): void {
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

  public get email() {
    return this.authService.email
  }

  public get clientRoles() {
    return this.authService.clientRoles
  }
}

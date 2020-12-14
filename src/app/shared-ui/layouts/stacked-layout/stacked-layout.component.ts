import {Component, Input, OnInit} from '@angular/core';
import {NavigationLink} from "../NavigationLinks";
import {AuthService} from "../../../core/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'stacked-layout',
  templateUrl: './stacked-layout.component.html'
})
export class StackedLayoutComponent implements OnInit {

  @Input() navigationLinks: NavigationLink[];

  public isOpen: boolean = false;
  public search: string;

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
  }

  logout() {
    this.authService.logout();
  }

  searchProject(event: KeyboardEvent) {
    if (event.code === 'Enter') {
      this.router.navigateByUrl("/projecten?name=" + this.search)
    }

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

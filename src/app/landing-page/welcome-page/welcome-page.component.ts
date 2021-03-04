import {Component, OnInit} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {AuthService} from "../../core/auth.service";

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html'
})
export class WelcomePageComponent implements OnInit {
  isOpen: boolean = false;

  constructor(private titleService: Title, private authService: AuthService) {
    this.titleService.setTitle("Welkom bij V.I.S");
  }

  ngOnInit(): void {

  }

  public login() {
    this.authService.login("dashboard");
  }
}

import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {AuthService} from '../../core/auth.service';

@Component({
  selector: 'vis-welcome-page',
  templateUrl: './welcome-page.component.html'
})
export class WelcomePageComponent implements OnInit {
  isOpen = false;

  constructor(private titleService: Title, public authService: AuthService) {
    this.titleService.setTitle('Welkom bij V.I.S');
  }

  ngOnInit(): void {

  }

  public login() {
    this.authService.login('dashboard');
  }
}

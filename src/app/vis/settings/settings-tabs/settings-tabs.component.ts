import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-settings-tabs',
  templateUrl: './settings-tabs.component.html'
})
export class SettingsTabsComponent implements OnInit {

  currentUrl: string;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.currentUrl = '/' + this.activatedRoute.snapshot.url.join('/');
  }

  navigate(location: string) {
    this.router.navigate([location]).then();
  }
}

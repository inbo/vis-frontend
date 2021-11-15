import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-location-tabs',
  templateUrl: './location-tabs.component.html'
})
export class LocationTabsComponent implements OnInit {
  code: string;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.code = this.activatedRoute.snapshot.params.code;
  }

  navigate(location: string) {
    this.router.navigate([location]).then();
  }

}

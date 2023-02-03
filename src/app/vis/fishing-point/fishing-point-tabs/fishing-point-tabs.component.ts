import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'vis-fishing-point-tabs',
  templateUrl: './fishing-point-tabs.component.html'
})
export class FishingPointTabsComponent implements OnInit {
  code: string;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.code = this.activatedRoute.snapshot.params.code;
  }

  navigate(location: string) {
    this.router.navigate([location]);
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ObservationId} from "../../project/model/observation";

@Component({
  selector: 'observation-tabs',
  templateUrl: './observation-tabs.component.html'
})
export class ObservationTabsComponent implements OnInit {

  @Input() projectCode : string;
  @Input() observationId : ObservationId;
  currentUrl: string;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.currentUrl = "/" + this.activatedRoute.snapshot.url.join("/")
  }

  navigate(location: string) {
    this.router.navigate([location]);
  }

}

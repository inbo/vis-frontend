import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-fish-species-tabs',
  templateUrl: './fish-species-tabs.component.html'
})
export class FishSpeciesTabsComponent implements OnInit {

  taxonId: number;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.taxonId = this.activatedRoute.snapshot.params.taxonId;
  }

  navigate(location: string) {
    this.router.navigate([location]).then();
  }

}

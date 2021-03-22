import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-project-fish-species-page',
  templateUrl: './project-fish-species-page.component.html'
})
export class ProjectFishSpeciesPageComponent implements OnInit {

  constructor(private titleService: Title, private activatedRoute: ActivatedRoute) {
    this.titleService.setTitle(`Project ${this.activatedRoute.parent.snapshot.params.projectCode} vissoorten`);
  }

  ngOnInit(): void {
  }

}

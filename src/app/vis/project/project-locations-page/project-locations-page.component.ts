import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-project-locations-page',
  templateUrl: './project-locations-page.component.html'
})
export class ProjectLocationsPageComponent implements OnInit {

  constructor(private titleService: Title, private activatedRoute: ActivatedRoute) {
    this.titleService.setTitle('Project ' + this.activatedRoute.parent.snapshot.params.projectCode + ' locaties');
  }

  ngOnInit(): void {
  }

}

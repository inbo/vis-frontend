import {Component, OnInit} from '@angular/core';
import {Project} from '../model/project';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-project-pictures-page',
  templateUrl: './project-pictures-page.component.html'
})
export class ProjectPicturesPageComponent implements OnInit {
  project: Project;

  constructor(private titleService: Title, private activatedRoute: ActivatedRoute) {
    this.titleService.setTitle(`Project ${this.activatedRoute.snapshot.parent.params.projectCode} afbeeldingen`);

  }

  ngOnInit(): void {
  }

}

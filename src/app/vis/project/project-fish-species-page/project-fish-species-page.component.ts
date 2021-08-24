import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {Taxon} from '../../../domain/taxa/taxon';
import {ProjectService} from '../../../services/vis.project.service';

@Component({
  selector: 'app-project-fish-species-page',
  templateUrl: './project-fish-species-page.component.html'
})
export class ProjectFishSpeciesPageComponent implements OnInit {

  taxon: Observable<Taxon[]>;

  projectCode: string;

  constructor(private titleService: Title, private activatedRoute: ActivatedRoute, private projectService: ProjectService) {
    this.titleService.setTitle(`Project ${this.activatedRoute.parent.snapshot.params.projectCode} vissoorten`);

    this.projectCode = this.activatedRoute.parent.snapshot.params.projectCode;
  }

  ngOnInit(): void {
    this.taxon = this.projectService.getProjectTaxa(this.activatedRoute.parent.snapshot.params.projectCode);
  }
}

import {Component, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
import {MethodsService} from '../../../services/vis.methods.service';
import {ProjectService} from '../../../services/vis.project.service';
import {Method} from '../../../domain/method/method';

@Component({
  selector: 'vis-project-methods-page',
  templateUrl: './project-methods-page.component.html'
})
export class ProjectMethodsPageComponent implements OnInit, OnDestroy {

  loading = false;
  methods: Method[];
  projectCode: string;

  private subscription = new Subscription();

  constructor(private titleService: Title, private methodsService: MethodsService,
              private projectService: ProjectService, private activatedRoute: ActivatedRoute) {
    this.titleService.setTitle(`Project ${this.activatedRoute.parent.snapshot.params.projectCode} methoden`);

    this.projectCode = this.activatedRoute.parent.snapshot.params.projectCode;

    this.subscription.add(
      this.methodsService.getAllMethodsForProject(this.activatedRoute.parent.snapshot.params.projectCode)
        .subscribe(value => this.methods = value)
    );

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

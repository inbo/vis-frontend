import {Component, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {Method} from '../../method/model/method';
import {Subscription} from 'rxjs';
import {MethodsService} from '../../../services/vis.methods.service';
import {ProjectService} from '../../../services/vis.project.service';

@Component({
  selector: 'app-project-methods-page',
  templateUrl: './project-methods-page.component.html'
})
export class ProjectMethodsPageComponent implements OnInit, OnDestroy {

  showEditTaxa = false;
  loading = false;
  methods: string[];
  allMethods: Method[];

  private subscription = new Subscription();

  constructor(private titleService: Title, private methodsService: MethodsService,
              private projectService: ProjectService, private activatedRoute: ActivatedRoute) {
    this.titleService.setTitle(`Project ${this.activatedRoute.parent.snapshot.params.projectCode} methoden`);

    this.subscription.add(
      this.projectService.getProjectMethods(this.activatedRoute.parent.snapshot.params.projectCode).subscribe(value => this.methods = value)
    );

    this.subscription.add(
      this.methodsService.getAllMethods().subscribe(value => {
        this.allMethods = value;
      })
    );

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  isSelected(method: Method) {
    return this.methods.some(item => item === method.code);
  }

  selectedChanged(event: any, item: Method) {
    if (event.target.checked) {
      this.methods.push(item.code);
    } else {
      this.methods = this.methods.filter(method => method !== item.code);
    }
  }

  saveProjectMethods() {
    this.subscription.add(this.methodsService.updateProjectMethods(this.activatedRoute.parent.snapshot.params.projectCode, this.methods)
      .subscribe(value => {
        this.methods = value;
        this.showEditTaxa = false;
      }));
  }
}

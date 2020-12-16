import { Component, OnInit } from '@angular/core';
import {NavigationLink} from "../../shared-ui/layouts/NavigationLinks";
import {GlobalConstants} from "../../GlobalConstants";
import {BreadcrumbLink} from "../../shared-ui/breadcrumb/BreadcrumbLinks";
import {Project} from "../model/project";
import {Title} from "@angular/platform-browser";
import {VisService} from "../../vis.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ProjectMethod} from '../model/project-method';
import {Method} from '../../method/model/method';

@Component({
  selector: 'app-project-methods-page',
  templateUrl: './project-methods-page.component.html'
})
export class ProjectMethodsPageComponent implements OnInit {

  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Projecten', url: '/projecten'},
    {title: this.activatedRoute.snapshot.params.projectCode, url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode},
    {title: 'Details', url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode}
  ]

  showEditTaxa = false;
  loading: boolean = false;
  project: Project;
  methods: ProjectMethod[]
  allMethods: Method[]

  constructor(private titleService: Title, private visService: VisService, private activatedRoute: ActivatedRoute, private router: Router) {
    this.titleService.setTitle("Project " + this.activatedRoute.snapshot.params.projectCode)

    this.visService.getProject(this.activatedRoute.snapshot.params.projectCode).subscribe(value => this.project = value)
    this.visService.getProjectMethods(this.activatedRoute.snapshot.params.projectCode).subscribe(value => this.methods = value)
    this.visService.getAllMethods().subscribe(value => {
      this.allMethods = value;
      debugger
    })
  }

  ngOnInit(): void {
  }

  isSelected(method: Method) {
    return this.methods.some(item => item.methodCode === method.code);
  }

  selectedChanged(event: any, item: Method) {
    if (event.target.checked) {
      this.methods.push({id: null, projectCode: this.activatedRoute.snapshot.params.projectCode, methodCode: item.code});
    } else {
      this.methods = this.methods.filter(method => method.methodCode !== item.code);
    }
  }

  saveProjectMethods() {
    this.visService.updateProjectMethods(this.activatedRoute.snapshot.params.projectCode, this.methods).subscribe(value => {
      this.methods = value;
      this.showEditTaxa = false;
    })
  }
}

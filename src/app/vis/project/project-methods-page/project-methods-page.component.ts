import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {BreadcrumbLink} from '../../../shared-ui/breadcrumb/BreadcrumbLinks';
import {Title} from '@angular/platform-browser';
import {VisService} from '../../../vis.service';
import {ActivatedRoute} from '@angular/router';
import {Method} from '../../method/model/method';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-project-methods-page',
  templateUrl: './project-methods-page.component.html'
})
export class ProjectMethodsPageComponent implements OnInit, OnDestroy {

  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Projecten', url: '/projecten'},
    {title: this.activatedRoute.snapshot.params.projectCode, url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode},
    {title: 'Details', url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode}
  ];

  showEditTaxa = false;
  loading = false;
  methods: string[];
  allMethods: Method[];

  private subscription = new Subscription();

  constructor(private titleService: Title, private visService: VisService, private activatedRoute: ActivatedRoute) {
    this.titleService.setTitle('Project ' + this.activatedRoute.snapshot.params.projectCode);

    this.subscription.add(
      this.visService.getProjectMethods(this.activatedRoute.snapshot.params.projectCode).subscribe(value => this.methods = value)
    );

    this.subscription.add(
      this.visService.getAllMethods().subscribe(value => {
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
    this.visService.updateProjectMethods(this.activatedRoute.snapshot.params.projectCode, this.methods).subscribe(value => {
      this.methods = value;
      this.showEditTaxa = false;
    });
  }
}

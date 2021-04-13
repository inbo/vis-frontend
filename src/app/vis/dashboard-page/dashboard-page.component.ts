import {Component, OnInit} from '@angular/core';
import {NavigationLink} from '../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../GlobalConstants';
import {Title} from '@angular/platform-browser';
import {BreadcrumbLink} from '../../shared-ui/breadcrumb/BreadcrumbLinks';
import {ServerAlertService} from '../../services/vis.server.alert.service';
import {Observable} from 'rxjs';
import {ServerAlert} from '../../domain/alert/server.alert';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html'
})
export class DashboardPageComponent implements OnInit {
  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Home', url: '/dashboard'},
  ];

  alerts$: Observable<ServerAlert[]>;

  constructor(private titleService: Title, private serverAlertService: ServerAlertService) {
    this.titleService.setTitle('VIS Dashboard');
    this.alerts$ = this.serverAlertService.getCurrentAlerts();
  }

  ngOnInit(): void {
  }

}

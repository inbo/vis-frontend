import {Component, OnInit} from '@angular/core';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {BreadcrumbLink} from '../../../shared-ui/breadcrumb/BreadcrumbLinks';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {TipsService} from '../../../services/vis.tips.service';

@Component({
  selector: 'app-tips',
  templateUrl: './tips.component.html'
})
export class TipsComponent implements OnInit {

  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Tips', url: '/tips'},
    {
      title: this.translateService.instant(this.activatedRoute.snapshot.params.tipPage),
      url: '/tips/' + this.activatedRoute.snapshot.params.tipPage
    },
    {title: '', url: ''}
  ];

  constructor(private activatedRoute: ActivatedRoute, private translateService: TranslateService) {
  }

  ngOnInit(): void {
  }
}

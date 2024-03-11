import {Component} from '@angular/core';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'vis-imports-overview',
  templateUrl: './imports-overview.component.html',
})
export class ImportsOverviewComponent {

  readonly links: NavigationLink[] = GlobalConstants.links;
  readonly tabs = [
    {label: 'Open', routerLink: ['/importeren', 'open']},
    {label: 'Afgesloten', routerLink: ['/importeren', 'afgesloten']},
  ];

  constructor(private titleService: Title) {
    this.titleService.setTitle('Imports');
  }
}

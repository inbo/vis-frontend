import {NavigationLink} from './shared-ui/layouts/NavigationLinks';

export class GlobalConstants {
  public static links: NavigationLink[] = [
    {title: 'Home', url: '/dashboard', sublinks: []},
    {title: 'Projecten', url: '/projecten', sublinks: []},
    {title: 'Locaties', url: '/locaties', sublinks: []},
    {title: 'Vissoorten', url: '/vissoorten', sublinks: []},
    {title: 'Methoden', url: '/methoden', sublinks: []},
    {title: 'Visindex', url: '/visindex', sublinks: []},
  ];

}

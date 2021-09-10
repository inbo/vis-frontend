import {NavigationLink} from './shared-ui/layouts/NavigationLinks';

export class GlobalConstants {
  public static links: NavigationLink[] = [
    {title: 'Home', url: '/dashboard', sublinks: []},
    {title: 'Projecten', url: '/projecten', sublinks: []},
    {title: 'Waarnemingen', url: '/waarnemingen', sublinks: []},
    {title: 'Locaties', url: '/locaties', sublinks: []},
    {title: 'Vissoorten', url: '/vissoorten', sublinks: []},
    {title: 'Methoden', url: '/methoden', sublinks: []},
    {title: 'Importeren', url: '/importeren', sublinks: []}
  ];

}

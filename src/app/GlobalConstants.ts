import {NavigationLink} from './shared-ui/layouts/NavigationLinks';
import {Role} from './core/_models/role';

export class GlobalConstants {
  public static links: NavigationLink[] = [
    {title: 'Home', url: '/dashboard', sublinks: [], role: null},
    {title: 'Projecten', url: '/projecten', sublinks: [], role: null},
    {title: 'Waarnemingen', url: '/waarnemingen', sublinks: [], role: null},
    {title: 'Locaties', url: '/locaties', sublinks: [], role: null},
    {title: 'Vissoorten', url: '/vissoorten', sublinks: [], role: null},
    {title: 'Methoden', url: '/methoden', sublinks: [], role: null},
    {title: 'Importeren', url: '/importeren', sublinks: [], role: Role.ReadImportfiles}
  ];

}

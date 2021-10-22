import {Role} from '../../core/_models/role';

export interface NavigationLink {
  url: string;
  title: string;
  role: Role;
  sublinks: NavigationSubLink[];
}

export interface NavigationSubLink {
  url: string;
  title: string;
  role: Role;
}

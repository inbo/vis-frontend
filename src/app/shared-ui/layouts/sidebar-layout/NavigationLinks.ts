export interface NavigationLink {
  url: string;
  title: string;
  sublinks: NavigationSubLink[];
}

export interface NavigationSubLink {
  url: string;
  title: string;
}

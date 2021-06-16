import {Team} from './team';

export interface Account {
  username: string;
  name: string;
  email: string;
  picture: string;
  team: Team;
}

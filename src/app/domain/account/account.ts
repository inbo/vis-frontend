import {Team} from './team';
import {Instance} from "./instance";

export interface Account {
  username: string;
  name: string;
  email: string;
  picture: string;
  teams: Team[];
  instances: Instance[];
}

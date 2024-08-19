import {ProjectTeam} from '../project/project';

export interface Account {
  username: string;
  name: string;
  email: string;
  picture: string;
  teams: ProjectTeam[];
  instances: string[];
}

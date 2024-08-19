export interface ProjectCode {
  value: string;
}

export interface ProjectTeam {
  instanceCode: string;
  code: string;
}

export interface Project {
  projectId: number;
  code: ProjectCode;
  name: string;
  description: string;
  status: string;
  fishingPointId: string;
  province: string;
  area: string;
  tandemvaultcollectionslug: string;
  start: Date;
  end: Date;
  lengthType: string;
  contact: string;
  teams: ProjectTeam[];
  instances: string[];
  canEdit: boolean;
  createUser: string;
  createDate: Date;
}



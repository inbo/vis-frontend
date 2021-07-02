export interface ProjectCode {
  value: string;
}

export interface Project {
  code: ProjectCode;
  name: string;
  description: string;
  status: string;
  location: string;
  province: string;
  area: string;
  start: Date;
  end: Date;
  lengthType: string;
  teams: string[];
  instances: string[];
  canEdit: boolean;
}



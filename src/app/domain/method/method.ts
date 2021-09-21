export interface Method {
  code: string;
  group: MethodGroup;
  description: string;
  calculation: string;
}

export interface MethodGroup {
  code: string;
  description: string;
}

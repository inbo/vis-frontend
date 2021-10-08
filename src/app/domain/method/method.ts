export interface Method {
  code: string;
  group: MethodGroup;
  description: string;
  unit: string;
  calculation: string;
}

export interface MethodGroup {
  code: string;
  description: string;
}

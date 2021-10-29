export interface Method {
  code: string;
  group: MethodGroup;
  description: string;
  weightUnit: string;
  amountUnit: string;
  calculation: string;
}

export interface MethodGroup {
  code: string;
  description: string;
}

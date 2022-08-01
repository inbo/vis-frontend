export interface SearchableSelectOption<V, K = string> {
  value: V;
  displayValue: K;
  externalLink?: string;
}

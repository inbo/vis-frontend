interface TaxonGroupId {
  value: number;
}

interface TaxonGroupCode {
  value: string;
}

export interface TaxonGroup {
  id: TaxonGroupId;
  code: TaxonGroupCode;
  description: string;
  name: string;
}

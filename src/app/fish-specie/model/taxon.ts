import {TaxonGroup} from './taxon-group';

interface TaxonId {
  value: number
}

interface TaxonCode {
  value: string
}

export interface Taxon {
  id: TaxonId,
  code: TaxonCode,
  nameDutch: string,
  taxonGroups: TaxonGroup[]
}

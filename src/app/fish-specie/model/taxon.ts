import {TaxonGroup} from './taxon-group';
import {TaxonId} from './taxon-id';
import {TaxonCode} from './taxon-code';

export interface Taxon {
  id: TaxonId,
  code: TaxonCode,
  nameDutch: string,
  taxonGroups: TaxonGroup[]
}

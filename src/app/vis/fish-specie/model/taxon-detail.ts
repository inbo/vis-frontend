import {TaxonId} from './taxon-id';
import {TaxonGroup} from './taxon-group';
import {TaxonCode} from './taxon-code';

export interface TaxonDetail {
  id: TaxonId;
  code: TaxonCode;
  lengthMin: number;
  lengthMax: number;
  weightMin: number;
  weightMax: number;
  nameDutch: string;
  taxonGroups: TaxonGroup[];
  taxonGroupText: string;
}

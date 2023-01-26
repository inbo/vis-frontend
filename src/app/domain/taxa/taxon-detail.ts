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
    vorkLengteFactor: number;
    minGewichtLengteFactor: number;
    maxGewichtLengteFactor: number;
    minGewichtLengteExponent: number;
    maxGewichtLengteExponent: number;
    maxGewichtLengteConstante: number;
    minGewichtLengteConstante: number;
    nameDutch: string;
    nameEnglish: string;
    nameFrench: string;
    nameGerman: string;
    nameScientific: string;
    taxonGroups: TaxonGroup[];
    taxonGroupText: string;
}

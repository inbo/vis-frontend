import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AsyncPage} from '../shared-ui/paging-async/asyncPage';
import {Observable, of} from 'rxjs';
import {Taxon} from '../domain/taxa/taxon';
import {TaxonGroup} from '../domain/taxa/taxon-group';
import {TaxonDetail} from '../domain/taxa/taxon-detail';
import {VisService} from './vis.service';
import {SearchableSelectOption} from '../shared-ui/searchable-select/SearchableSelectOption';
import {map, take, tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class TaxaService extends VisService {

    allTaxonOptions: Array<SearchableSelectOption<number>>;

    constructor(private http: HttpClient) {
        super();
    }

    getTaxa(val: string, id?: number) {
        let params = new HttpParams();

        if (val !== null && val !== undefined) {
            params = params.set('nameDutch', val);
        }

        if (id !== undefined) {
            params = params.set('id', id.toString());
        }

        return this.http.get<Taxon[]>(`${environment.apiUrl}/api/taxon`, {params});
    }

    getFilteredTaxa(page: number, size: number, filter: any) {
        const params = this.getPageParams(page, size, filter);

        return this.http.get<AsyncPage<Taxon>>(`${environment.apiUrl}/api/taxon/search`, {params});
    }

    getTaxon(id: number): Observable<TaxonDetail> {
        return this.http.get<TaxonDetail>(`${environment.apiUrl}/api/taxon/${id}`);
    }

    getTaxonGroups() {
        return this.http.get<Array<TaxonGroup>>(`${environment.apiUrl}/api/taxon/groups`);
    }

    getAllSpeciesOptions(): Observable<Array<SearchableSelectOption<number>>> {
        if (this.allTaxonOptions) {
            return of(this.allTaxonOptions);
        }
        return this.getTaxa(undefined, undefined)
            .pipe(
                take(1),
                map(taxa => taxa.map(taxon => ({
                    displayValue: taxon.nameDutch,
                    externalLink: `/vissoorten/${taxon.id.value}`,
                    value: taxon.id.value,
                } as SearchableSelectOption<number>))),
                tap(taxa => this.allTaxonOptions = taxa),
            );
    }
}

import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AsyncPage} from '../shared-ui/paging-async/asyncPage';
import {Observable} from 'rxjs';
import {Taxon} from '../domain/taxa/taxon';
import {TaxonGroup} from '../domain/taxa/taxon-group';
import {TaxonDetail} from '../domain/taxa/taxon-detail';
import {VisService} from './vis.service';
import {SearchableSelectOption} from '../shared-ui/searchable-select/SearchableSelectOption';
import {map, take} from 'rxjs/operators';
import {withCache} from '@ngneat/cashew';

@Injectable({
    providedIn: 'root',
})
export class TaxaService extends VisService {

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

        return this.http.get<Taxon[]>(`${environment.apiUrl}/api/taxon`, {params, context: withCache()});
    }

    getFilteredTaxa(page: number, size: number, filter: any) {
        const params = this.getPageParams(page, size, filter);

        return this.http.get<AsyncPage<Taxon>>(`${environment.apiUrl}/api/taxon/search`, {params, context: withCache()});
    }

    getTaxon(id: number): Observable<TaxonDetail> {
        return this.http.get<TaxonDetail>(`${environment.apiUrl}/api/taxon/${id}`, {context: withCache()});
    }

    getTaxonGroups() {
        return this.http.get<Array<TaxonGroup>>(`${environment.apiUrl}/api/taxon/groups`, {context: withCache()});
    }

    getAllSpeciesOptions(): Observable<Array<SearchableSelectOption<number>>> {
        return this.getTaxa(undefined, undefined)
            .pipe(
                take(1),
                map(taxa => taxa.map(taxon => ({
                    displayValue: taxon.nameDutch,
                    externalLink: `/vissoorten/${taxon.id.value}`,
                    value: taxon.id.value,
                } as SearchableSelectOption<number>))),
            );
    }
}

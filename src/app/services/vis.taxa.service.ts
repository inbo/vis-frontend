import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AsyncPage} from '../shared-ui/paging-async/asyncPage';
import {Observable} from 'rxjs';
import {Taxon} from '../domain/taxa/taxon';
import {TaxonGroup} from '../domain/taxa/taxon-group';
import {TaxonDetail} from '../domain/taxa/taxon-detail';
import {VisService} from './vis.service';

@Injectable({
  providedIn: 'root'
})
export class TaxaService extends VisService {

  constructor(private http: HttpClient) {
    super();
  }

  getTaxa(val: string, id?: number) {
    let params = new HttpParams()
      .set('nameDutch', val);

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
    return this.http.get<TaxonGroup[]>(`${environment.apiUrl}/api/taxon/groups`);
  }
}

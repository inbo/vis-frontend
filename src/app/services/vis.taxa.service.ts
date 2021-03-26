import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AsyncPage} from '../shared-ui/paging-async/asyncPage';
import {Observable} from 'rxjs';
import {Taxon} from '../vis/fish-specie/model/taxon';
import {TaxonGroup} from '../vis/fish-specie/model/taxon-group';
import {TaxonDetail} from '../vis/fish-specie/model/taxon-detail';
import {VisService} from './vis.service';

@Injectable({
  providedIn: 'root'
})
export class TaxaService extends VisService {

  constructor(private http: HttpClient) {
    super();
  }

  getTaxa(val: string) {
    const params = new HttpParams()
      .set('nameDutch', val)
      .set('nameScientific', val)
      .set('taxonCode', val);

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
    return this.http.get<AsyncPage<TaxonGroup>>(`${environment.apiUrl}/api/taxon/groups`);
  }
}

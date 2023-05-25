import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AsyncPage} from '../shared-ui/paging-async/asyncPage';
import {VisService} from './vis.service';
import {CreateImportFileResult, Import, ImportDetail} from '../domain/imports/imports';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImportsService extends VisService {

  constructor(private http: HttpClient) {
    super();
  }

  getImports(page: number, size: number) {
    const params = this.getPageParams(page, size, []);

    return this.http.get<AsyncPage<Import>>(`${environment.apiUrl}/api/imports`, {params});
  }

  getProcessedImports(page: number, size: number) {
    const params = this.getPageParams(page, size, []);

    return this.http.get<AsyncPage<Import>>(`${environment.apiUrl}/api/imports/processed`, {params});
  }

  getImport(id: string): Observable<ImportDetail> {
    return this.http.get<ImportDetail>(`${environment.apiUrl}/api/imports/${id}`, {});
  }

  doImport(id: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/api/imports/${id}/import`, {});
  }

  createFile(projectCode: any): Observable<CreateImportFileResult> {
    return this.http.post<CreateImportFileResult>(`${environment.apiUrl}/api/imports/project/${projectCode}`, {});
  }
}

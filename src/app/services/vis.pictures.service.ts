import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AsyncPage} from '../shared-ui/paging-async/asyncPage';
import {VisService} from './vis.service';
import {TandemvaultDownloadResult, TandemvaultPicture, TandemvaultPictureDetail} from '../domain/tandemvault/picture';


@Injectable({
  providedIn: 'root'
})
export class PicturesService extends VisService {

  constructor(private http: HttpClient) {
    super();
  }

  getPictures(page: number, slug: string) {
    const params = new HttpParams().set('page', page ? page.toString() : '0');

    return this.http.get<AsyncPage<TandemvaultPicture>>(`${environment.apiUrl}/api/pictures/slug/` + slug, {params});
  }

  getPicture(id: number) {
    return this.http.get<TandemvaultPictureDetail>(`${environment.apiUrl}/api/pictures/` + id);
  }

  downloadPicture(id: number) {
    return this.http.get<TandemvaultDownloadResult>(`${environment.apiUrl}/api/pictures/download/` + id);
  }
}

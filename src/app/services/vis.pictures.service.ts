import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpParams, HttpRequest} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AsyncPage} from '../shared-ui/paging-async/asyncPage';
import {VisService} from './vis.service';
import {CollectionDetail, TandemvaultDownloadResult, TandemvaultPicture, TandemvaultPictureDetail} from '../domain/tandemvault/picture';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PicturesService extends VisService {

  constructor(private http: HttpClient) {
    super();
  }

  getPictures(page: number, projectCode: string) {
    const params = new HttpParams().set('page', page ? page.toString() : '0');

    return this.http.get<AsyncPage<TandemvaultPicture>>(`${environment.apiUrl}/api/pictures/project/` + projectCode, {params});
  }

  getPicturesForSurveyEvent(page: number, projectCode: string, surveyEventId: number) {
    const params = new HttpParams().set('page', page ? page.toString() : '0');

    return this.http.get<AsyncPage<TandemvaultPicture>>(`${environment.apiUrl}/api/pictures/project/${projectCode}/surveyevent/${surveyEventId}`, {params});
  }

  getPicture(id: number) {
    return this.http.get<TandemvaultPictureDetail>(`${environment.apiUrl}/api/pictures/` + id);
  }

  allCollections(): Observable<CollectionDetail[]> {
    return this.http.get<CollectionDetail[]>(`${environment.apiUrl}/api/pictures/collections`);
  }

  reloadCollections(): Observable<CollectionDetail[]> {
    return this.http.get<CollectionDetail[]>(`${environment.apiUrl}/api/pictures/collections/reload`);
  }

  downloadPicture(id: number) {
    return this.http.get<TandemvaultDownloadResult>(`${environment.apiUrl}/api/pictures/download/` + id);
  }

  addTagsForSurveyEvent(id: number, projectCode: string, surveyEventId: number): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/api/pictures/project/${projectCode}/surveyevent/${surveyEventId}/assets/${id}/addtags`, {});
  }

  upload(file: File, projectCode: string, surveyEventId: number): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest(
      'POST',
      `${environment.apiUrl}/api/pictures/project/${projectCode}/surveyevent/${surveyEventId}/upload`,
      formData,
      {
        reportProgress: true,
        responseType: 'json'
      });

    return this.http.request(req);

  }
}

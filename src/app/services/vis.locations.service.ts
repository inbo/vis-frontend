import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AsyncPage} from '../shared-ui/paging-async/asyncPage';
import {Observable} from 'rxjs';
import {FishingPoint, FishingPointFeature, FishingPointSearch} from '../domain/location/fishing-point';
import {VisService} from './vis.service';
import {VhaUrl} from '../domain/location/vha-version';
import {ProjectFishingPoint} from '../domain/location/project-fishing-point';


@Injectable({
  providedIn: 'root'
})
export class LocationsService extends VisService {

  constructor(private http: HttpClient) {
    super();
  }

  getFishingPoints(page: number, size: number) {
    const params = this.getPageParams(page, size, {});

    return this.http.get<AsyncPage<FishingPoint>>(`${environment.apiUrl}/api/fishingpoints`, {params});
  }

  create(formData: any) {
    return this.http.post(environment.apiUrl + '/api/fishingpoints', formData);
  }

  getFishingPointsFeatures(projectCode?: string): Observable<FishingPointFeature[]> {
    if (projectCode) {
      return this.http.get<FishingPointFeature[]>(`${environment.apiUrl}/api/fishingpoints/project/${projectCode}/features`, {});
    }
    return this.http.get<FishingPointFeature[]>(`${environment.apiUrl}/api/fishingpoints/features`, {});
  }

  latestVhaVersion(): Observable<VhaUrl> {
    return this.http.get<VhaUrl>(`${environment.apiUrl}/api/vhaversion/latest`, {});
  }

  checkIfFishingPointExists(code: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/validation/fishingpoint/code/${code}`, {});
  }

  searchFishingPoints(val: any, id: number): Observable<FishingPointSearch[]> {
    let params = new HttpParams()
      .set('code', val)
      .set('description', val);

    if (id) {
      params = params.set('id', id?.toString());
    }

    return this.http.get<FishingPointSearch[]>(`${environment.apiUrl}/api/fishingpoints/search`, {params});
  }

  findById(id: number): Observable<FishingPoint> {
    return this.http.get<FishingPoint>(`${environment.apiUrl}/api/fishingpoints/${id}`, {});
  }

  findByCode(code: string): Observable<FishingPoint> {
    return this.http.get<FishingPoint>(`${environment.apiUrl}/api/fishingpoints/code/${code}`, {});
  }

  findByProjectCode(code: string, page: number, size: number): Observable<AsyncPage<ProjectFishingPoint>> {
    const params = this.getPageParams(page, size, {});

    return this.http.get<AsyncPage<ProjectFishingPoint>>(`${environment.apiUrl}/api/fishingpoints/projectcode/${code}`, {params});
  }
}

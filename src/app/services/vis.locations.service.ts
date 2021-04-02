import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AsyncPage} from '../shared-ui/paging-async/asyncPage';
import {Observable, Subscription} from 'rxjs';
import {FishingPoint, FishingPointFeature} from '../domain/location/fishing-point';
import {VisService} from './vis.service';
import {VhaUrl} from '../domain/location/vha-version';


@Injectable({
  providedIn: 'root'
})
export class LocationsService extends VisService {

  private subscription = new Subscription();

  constructor(private http: HttpClient) {
    super();
  }

  getFishingPoints(page: number, size: number) {
    const params = this.getPageParams(page, size, {});

    return this.http.get<AsyncPage<FishingPoint>>(`${environment.apiUrl}/api/fishingpoints`, {params});
  }

  getFishingPointsFeatures(): Observable<FishingPointFeature[]> {
    return this.http.get<FishingPointFeature[]>(`${environment.apiUrl}/api/fishingpoints/features`, {});
  }

  latestVhaVersion(): Observable<VhaUrl> {
    return this.http.get<VhaUrl>(`${environment.apiUrl}/api/vhaversion/latest`, {});
  }

  checkIfFishingPointExists(code: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/validation/fishingpoint/code/${code}`, {});
  }
}

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AsyncPage} from '../shared-ui/paging-async/asyncPage';
import {Subscription} from 'rxjs';
import {FishingPoint} from '../vis/project/model/fishing-point';
import {VisService} from './vis.service';


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

    return this.http.get<AsyncPage<FishingPoint>>(environment.apiUrl + '/api/fishingpoints', {params});
  }
}

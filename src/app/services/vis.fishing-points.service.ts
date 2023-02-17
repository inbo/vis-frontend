import {Injectable} from '@angular/core';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AsyncPage} from '../shared-ui/paging-async/asyncPage';
import {Observable} from 'rxjs';
import {FishingPoint, FishingPointFeature, FishingPointSearch} from '../domain/fishing-point/fishing-point';
import {VisService} from './vis.service';
import {VhaUrl} from '../domain/fishing-point/vha-version';
import {ProjectFishingPoint} from '../domain/fishing-point/project-fishing-point';
import {Watercourse} from '../domain/fishing-point/watercourse';
import {Basin} from '../domain/fishing-point/basin';
import {Coordinates} from '../domain/fishing-point/coordinates';
import {LenticWaterbody} from '../domain/fishing-point/lentic-waterbody';
import {AsyncValidationResult} from './validation';
import {IndexType} from '../domain/fishing-point/index-type';
import {Municipality} from '../domain/fishing-point/municipality';
import {FishingPointCode} from '../domain/fishing-point/fishing-point-code';
import {Province} from '../domain/fishing-point/province';
import {map} from 'rxjs/operators';


@Injectable({
    providedIn: 'root',
})
export class FishingPointsService extends VisService {

    constructor(private http: HttpClient) {
        super();
    }

    public downloadFile(res: HttpResponse<Blob>) {
        const contentDisposition = res.headers.get('content-disposition');
        const filename = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim().replace(/"/g, '');
        const url = window.URL.createObjectURL(res.body);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;

        link.click();
    }

    getFishingPoints(page: number, size: number, filter: any): Observable<AsyncPage<FishingPoint>> {
        const params = this.getPageParams(page, size, filter);

        return this.http.get<AsyncPage<FishingPoint>>(`${environment.apiUrl}/api/fishingpoints`, {params});
    }

    create(formData: any): Observable<void> {
        return this.http.post<void>(environment.apiUrl + '/api/fishingpoints', formData);
    }

    getFishingPointsFeatures(projectCode?: string, filter?: any): Observable<FishingPointFeature[]> {
        const params = this.getParams(filter);

        if (projectCode) {
            return this.http.get<FishingPointFeature[]>(`${environment.apiUrl}/api/fishingpoints/project/${projectCode}/features`);
        }
        return this.http.get<FishingPointFeature[]>(`${environment.apiUrl}/api/fishingpoints/features`, {params});
    }

    getFishingPointCodes(filter: any): Observable<Array<string>> {
        const params = this.getParams(filter);

        return this.http
            .get<{ fishingPointCodes: Array<string> }>(`${environment.apiUrl}/api/fishingpointcodes`, {params})
            .pipe(
                map(responseBody => responseBody.fishingPointCodes),
            );
    }

    latestVhaVersion(): Observable<VhaUrl> {
        return this.http.get<VhaUrl>(`${environment.apiUrl}/api/vhaversion/latest`, {});
    }

    checkIfFishingPointExists(code: string): Observable<AsyncValidationResult> {
        return this.http.get<AsyncValidationResult>(`${environment.apiUrl}/api/validation/fishingpoint/code/${code}`, {});
    }

    searchFishingPoints(searchTerm: string, id: number): Observable<FishingPointSearch[]> {
        let params = new HttpParams();
        if (searchTerm) {
            params = params
                .set('code', searchTerm)
                .set('description', searchTerm);
        }
        if (id) {
            params = params.set('id', id?.toString());
        }

        return this.http.get<FishingPointSearch[]>(`${environment.apiUrl}/api/fishingpoints/search`, {params});
    }

    findById(id: number): Observable<FishingPoint> {
        return this.http.get<FishingPoint>(`${environment.apiUrl}/api/fishingpoints/${id}`);
    }

    findByCode(code: string): Observable<FishingPoint> {
        return this.http.get<FishingPoint>(`${environment.apiUrl}/api/fishingpoints/code/${code}`);
    }

    findByProjectCode(code: string, page: number, size: number, filter: any): Observable<AsyncPage<ProjectFishingPoint>> {
        const params = this.getPageParams(page, size, filter);

        return this.http.get<AsyncPage<ProjectFishingPoint>>(`${environment.apiUrl}/api/fishingpoints/projectcode/${code}`, {params});
    }

    searchWatercourses(watercourse?: string): Observable<Watercourse[]> {
        let params = new HttpParams();
        if (watercourse) {
            params = params.set('watercourse', watercourse);
        }

        return this.http.get<Watercourse[]>(`${environment.apiUrl}/api/watercourses/search`, {params});
    }

    searchBasins(basin?: string): Observable<Basin[]> {
        let params = new HttpParams();
        if (basin) {
            params = params.set('basin', basin);
        }

        return this.http.get<Basin[]>(`${environment.apiUrl}/api/basins/search`, {params});
    }

    searchProvinces(q?: string): Observable<Province[]> {
        let params = new HttpParams();
        if (q) {
            params = params.set('q', q);
        }

        return this.http.get<Province[]>(`${environment.apiUrl}/api/provinces/search`, {params});
    }

    searchMunicipalities(q?: string): Observable<Municipality[]> {
        let params = new HttpParams();
        if (q) {
            params = params.set('q', q);
        }

        return this.http.get<Municipality[]>(`${environment.apiUrl}/api/municipalities/search`, {params});
    }

    searchLenticWaterbodyNames(name?: string): Observable<LenticWaterbody[]> {
        let params = new HttpParams();
        if (name) {
            params = params.set('name', name);
        }

        return this.http.get<LenticWaterbody[]>(`${environment.apiUrl}/api/lenticwaterbody/search`, {params});
    }

    searchFishingPointCodes(name?: string): Observable<FishingPointCode[]> {
        let params = new HttpParams();
        if (name) {
            params = params.set('name', name);
        }

        return this.http.get<FishingPointCode[]>(`${environment.apiUrl}/api/fishingpointcode/search`, {params});
    }

    convertCoordinates(x: number, y: number, source: string): Observable<Coordinates> {
        const params = new HttpParams()
            .set('x', x.toString())
            .set('y', y.toString())
            .set('source', source);
        return this.http.get<Coordinates>(`${environment.apiUrl}/api/coordinates/convert`, {params});
    }

    updateFishingPoint(fishingPointId: number, formData: any) {
        return this.http.put(`${environment.apiUrl}/api/fishingpoints/${fishingPointId}`, formData);
    }

    canDeleteFishingPoint(id: number): Observable<boolean> {
        return this.http.get<boolean>(`${environment.apiUrl}/api/fishingpoints/${id}/candelete`);
    }

    deleteFishingPoint(id: number): Observable<void> {
        return this.http.delete<void>(`${environment.apiUrl}/api/fishingpoints/${id}`);
    }

    listIndexTypes() {
        return this.http.get<IndexType[]>(`${environment.apiUrl}/api/indextypes/all`);
    }

    exportFishingPoints(fishingPointCodesToExport: string[], filename: string) {
        const params = new HttpParams();

        return this.http.post(`${environment.apiUrl}/api/fishingpoints/export`,
            {codes: fishingPointCodesToExport, filename}, {params, observe: 'response', responseType: 'blob'});
    }
}

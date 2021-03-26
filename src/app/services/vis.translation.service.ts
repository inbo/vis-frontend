import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {VisService} from './vis.service';

@Injectable({
  providedIn: 'root'
})
export class TranslationService extends VisService {

  constructor(private http: HttpClient) {
    super();
  }

  translations(lang: string) {
    return this.http.get<any>(`${environment.apiUrl}/translations/${lang}`);
  }
}

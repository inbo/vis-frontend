import {HttpClient} from '@angular/common/http';
import {TranslateLoader} from '@ngx-translate/core';
import {forkJoin, Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {all} from 'deepmerge';
import {InterceptorSkipHeader} from './http.error.interceptor';

export interface ITranslationResource {
  prefix: string;
  suffix: string;
}

export class MultiTranslateHttpLoader implements TranslateLoader {
  constructor(private http: HttpClient, private resources: ITranslationResource[]) {
  }

  public getTranslation(lang: string): Observable<any> {
    const requests = this.resources.map(resource => {
      const path = resource.prefix + lang + resource.suffix;
      return this.http.get(path, {headers: InterceptorSkipHeader}).pipe(catchError(res => {
        console.error('Something went wrong for the following translation file:', path);
        console.error(res.message);
        return of({});
      }));
    });
    return forkJoin(requests).pipe(
      map(response => all(response))
    );
  }
}

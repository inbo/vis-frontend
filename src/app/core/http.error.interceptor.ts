import {Inject, Injectable, Injector} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {EMPTY, Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

export const InterceptorSkip = 'X-Skip-Interceptor';
export const InterceptorSkipHeader = new HttpHeaders({
  'X-Skip-Interceptor': ''
});

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router,
              @Inject(Injector) private injector: Injector) {
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.headers && request.headers.has(InterceptorSkip)) {
      const headers = request.headers.delete(InterceptorSkip);
      return next.handle(request.clone({headers}));
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof Error) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
          const translateService = this.injector.get(TranslateService);
          const toastrService = this.injector.get(ToastrService);

          if (error.status === 0) {
            this.router.navigateByUrl('/service-unavailable');
          }
          if (error.status === 400) {
              toastrService.error(error.error, translateService.instant('error.bad-request'));
              return of(new HttpResponse({body: {code: 400}}));
          }
          if (error.status === 403) {
            this.router.navigateByUrl('/forbidden');
          }
          if (error.status === 404) {
            this.router.navigateByUrl('/not-found', {replaceUrl: true});
          }
          if (error.status === 500) {
            toastrService.error(translateService.instant('general-error.message'), translateService.instant('general-error.title'));
          }
          if (error.status === 503) {
            this.router.navigateByUrl('/service-unavailable');
          }
        }

        // ...optionally return a default fallback value so app can continue (pick one)
        // which could be a default value (which has to be a HttpResponse here)
        // return Observable.of(new HttpResponse({body: [{name: "Default value..."}]}));
        // or simply an empty observable
        return EMPTY;
        // return throwError(error);
      })
    ) as Observable<HttpEvent<any>>;
  }
}

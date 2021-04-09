import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {EMPTY, Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) {
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof Error) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.error(`Backend returned code ${error.status}, body was: ${error.error}`);

          if(error.status === 0) {
            this.router.navigateByUrl('/service-unavailable').then();
          }
          if (error.status === 400) {
            return of(new HttpResponse({body: {code: 400}}));
          }
          if (error.status === 403) {
            this.router.navigateByUrl('/forbidden').then();
          }
          if (error.status === 500) {
            this.router.navigateByUrl('/internal-server-error').then();
          }
          if (error.status === 503) {
            this.router.navigateByUrl('/service-unavailable').then();
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

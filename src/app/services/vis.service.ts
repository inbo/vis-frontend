import {HttpParams} from "@angular/common/http";

export class VisService {

  protected getPageParams(page: number, size: number, filter: any): HttpParams {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    Object.keys(filter ?? []).forEach((key) => {
      if (filter[key]) {
        params = params.set(key, filter[key].toString());
      }
    });
    return params;
  }
}

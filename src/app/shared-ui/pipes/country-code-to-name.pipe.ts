import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  standalone: true,
  name: 'countryCodeToName',
})
export class CountryCodeToNamePipe implements PipeTransform {
  countryDescriptions = {
    FR: 'Frankrijk',
    DE: 'Duitsland',
    NL: 'Nederland',
    LU: 'Luxemburg',
  };

  transform(code: string): string {
    return this.countryDescriptions[code] || 'België';
  }
}

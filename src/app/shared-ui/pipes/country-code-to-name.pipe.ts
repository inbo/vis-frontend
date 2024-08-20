import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  standalone: true,
  name: 'countryCodeToName',
})
export class CountryCodeToNamePipe implements PipeTransform {
  countryDescriptions = {
    BE: 'België',
    FR: 'Frankrijk',
    DE: 'Duitsland',
    NL: 'Nederland',
  };

  transform(code: string): string {
    return this.countryDescriptions[code] || 'België';
  }
}

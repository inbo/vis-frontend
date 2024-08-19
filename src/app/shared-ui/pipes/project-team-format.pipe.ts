import {Pipe} from '@angular/core';
import {ProjectTeam} from '../../domain/project/project';

@Pipe({
  name: 'visProjectTeamFormat',
  standalone: true,
  pure: true
})
export class ProjectTeamFormatPipe {
  transform(value: ProjectTeam, showOnlyTeamCode?: boolean): string {
    if (!value) {
      return '';
    }
    if (showOnlyTeamCode) {
      return value.code;
    }
    return `${value.instanceCode}/${value.code}`;
  }
}

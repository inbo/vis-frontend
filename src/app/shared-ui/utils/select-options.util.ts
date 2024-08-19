import {Instance} from '../../domain/account/instance';
import {MultiSelectOption} from '../multi-select/multi-select';
import {Team} from '../../domain/account/team';
import {ProjectTeam} from '../../domain/project/project';

export function instanceToSelectOption(instance: Instance): MultiSelectOption {
  return {value: instance.code, displayValue: instance.code};
}

export function teamToProjectTeamSelectOption(team: Team): MultiSelectOption {
  return {
    value: {code: team.code, instanceCode: team.instanceCode} as ProjectTeam,
    displayValue: `${team.name}`,
  };
}

import {Injectable} from '@angular/core';
import {Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';
import {ProjectTeam} from '../../domain/project/project';

@Injectable({
      providedIn: 'root',
    },
)
export class ProjectTeamFormSyncService {

  syncTeamsAndInstances(
      teamsFormControl: FormControl<ProjectTeam[]>,
      instancesFormControl: FormControl<string[]>,
      subscription: Subscription,
  ) {
    subscription.add(teamsFormControl.valueChanges.subscribe((teams: ProjectTeam[]) => {
      if (teams.length > 0) {
        instancesFormControl.patchValue([
          ...new Set([
            ...teams.map(team => team.instanceCode),
            ...instancesFormControl.value,
          ])
        ]);
      }
    }));

    subscription.add(instancesFormControl.valueChanges.subscribe((instanceCodes: string[]) => {
      const teams = teamsFormControl.value;
      const newTeams = teams.filter(team => instanceCodes.includes(team.instanceCode));
      // check if teams is different than newTeams
      if (JSON.stringify(teams) !== JSON.stringify(newTeams)) {
        teamsFormControl.patchValue(newTeams);
      }
    }));
  }
}
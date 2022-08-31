import {Injectable} from '@angular/core';
import {RadioOption} from '../../shared-ui/radio-group/radioOption';
import {Agriculture, Buildings, Current, Meadow, Shelter, Shore, Slope, Trees, WaterLevel} from '../../domain/survey-event/habitat';
import {CheckOption} from '../../shared-ui/check-group/checkOption';

@Injectable({
  providedIn: 'root'
})
export class HabitatOptionsService {
  private _waterLevels: RadioOption<string>[];
  private _shelters: RadioOption<string>[];
  private _pool: RadioOption<boolean>[];
  private _rapids: RadioOption<boolean>[];
  private _creeks: RadioOption<boolean>[];
  private _agriculture: RadioOption<string>[];
  private _buildings: RadioOption<string>[];
  private _industry: RadioOption<boolean>[];
  private _current: RadioOption<string>[];
  private _fishPassage: RadioOption<boolean>[];
  private _meadow: RadioOption<string>[];
  private _shore: RadioOption<string>[];
  private _slope: RadioOption<string>[];
  private _trees: RadioOption<string>[];
  private _soil: CheckOption[];
  private _bottlenecks: CheckOption[];
  private _vegetations: CheckOption[];

  constructor() {
    this._waterLevels = Object.keys(WaterLevel).filter(value => isNaN(Number(value))).map(value => this.createOption('waterLevel', value));
    this._shelters = Object.keys(Shelter).filter(value => isNaN(Number(value))).map(value => this.createOption('shelter', value));
    this._pool = [{text: 'surveyEvent.habitat.pool.true', value: true}, {text: 'surveyEvent.habitat.pool.false', value: false},
      {text: 'surveyEvent.habitat.pool.null', value: null}];
    this._rapids = [{text: 'surveyEvent.habitat.rapids.true', value: true}, {text: 'surveyEvent.habitat.rapids.false', value: false},
      {text: 'surveyEvent.habitat.rapids.null', value: null}];
    this._creeks = [{text: 'surveyEvent.habitat.creeks.true', value: true}, {text: 'surveyEvent.habitat.creeks.false', value: false},
      {text: 'surveyEvent.habitat.creeks.null', value: null}];
    this._shore = Object.keys(Shore).filter(value => isNaN(Number(value))).map(value => this.createOption('shore', value));
    this._slope = Object.keys(Slope).filter(value => isNaN(Number(value))).map(value => this.createOption('slope', value));
    this._agriculture = Object.keys(Agriculture).filter(value => isNaN(Number(value))).map(value =>
      this.createOption('agriculture', value));
    this._meadow = Object.keys(Meadow).filter(value => isNaN(Number(value))).map(value => this.createOption('meadow', value));
    this._trees = Object.keys(Trees).filter(value => isNaN(Number(value))).map(value => this.createOption('trees', value));
    this._buildings = Object.keys(Buildings).filter(value => isNaN(Number(value))).map(value => this.createOption('buildings', value));
    this._industry = [{text: 'surveyEvent.habitat.industry.true', value: true}, {text: 'surveyEvent.habitat.industry.false', value: false},
      {text: 'surveyEvent.habitat.industry.null', value: null}];
    this._current = Object.keys(Current).filter(value => isNaN(Number(value))).map(value => this.createOption('current', value));
    this._fishPassage = [{text: 'surveyEvent.habitat.fish-passage.true', value: true},
      {text: 'surveyEvent.habitat.fish-passage.false', value: false}, {text: 'surveyEvent.habitat.fish-passage.null', value: null}];
    this._soil = ['other', 'grint', 'clay', 'mudd', 'silt', 'stones', 'sand', 'unknownSoil'].map(value => this.createOption('soil', value));
    this._bottlenecks = ['motorway', 'diver', 'mill', 'undefined', 'lock', 'reservoir', 'weir', 'decay', 'unknownBottleneck'].map(value =>
      this.createOption('bottleneck', value));
    this._vegetations = ['filamentousAlgae', 'soilWaterPlants', 'threadAlgae', 'unknownVegetation'].map(value => this.createOption('vegetation', value));
  }

  private createOption(x: string, value: string): RadioOption<string> {
    const text = `surveyEvent.habitat.${x}.${value}`;
    return {value, text};
  }

  get waterLevels(): RadioOption<string>[] {
    return this._waterLevels;
  }

  get shelters(): RadioOption<string>[] {
    return this._shelters;
  }

  get pool(): RadioOption<boolean>[] {
    return this._pool;
  }

  get rapids(): RadioOption<boolean>[] {
    return this._rapids;
  }

  get creeks(): RadioOption<boolean>[] {
    return this._creeks;
  }

  get agriculture(): RadioOption<string>[] {
    return this._agriculture;
  }

  get buildings(): RadioOption<string>[] {
    return this._buildings;
  }

  get industry(): RadioOption<boolean>[] {
    return this._industry;
  }

  get current(): RadioOption<string>[] {
    return this._current;
  }

  get fishPassage(): RadioOption<boolean>[] {
    return this._fishPassage;
  }

  get meadow(): RadioOption<string>[] {
    return this._meadow;
  }

  get shore(): RadioOption<string>[] {
    return this._shore;
  }

  get slope(): RadioOption<string>[] {
    return this._slope;
  }

  get trees(): RadioOption<string>[] {
    return this._trees;
  }

  get soil(): CheckOption[] {
    return this._soil;
  }

  get bottlenecks(): CheckOption[] {
    return this._bottlenecks;
  }

  get vegetations(): CheckOption[] {
    return this._vegetations;
  }
}

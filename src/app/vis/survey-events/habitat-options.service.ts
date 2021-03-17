import {Injectable} from '@angular/core';
import {RadioOption} from '../../shared-ui/radio-group/radioOption';
import {
  Agriculture,
  Bottleneck,
  Buildings,
  Loop,
  Meadow,
  Shelter,
  Shore,
  Slope,
  Soil,
  Trees,
  Vegetation,
  WaterLevel
} from './model/habitat';
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
  private _loop: RadioOption<string>[];
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
    this._pool = [{text: 'surveyEvent.habitat.pool.true', value: true}, {text: 'surveyEvent.habitat.pool.false', value: false}];
    this._rapids = [{text: 'surveyEvent.habitat.rapids.true', value: true}, {text: 'surveyEvent.habitat.rapids.false', value: false}];
    this._creeks = [{text: 'surveyEvent.habitat.creeks.true', value: true}, {text: 'surveyEvent.habitat.creeks.false', value: false}];
    this._agriculture = Object.keys(Agriculture).filter(value => isNaN(Number(value))).map(value =>
      this.createOption('agriculture', value));
    this._buildings = Object.keys(Buildings).filter(value => isNaN(Number(value))).map(value => this.createOption('buildings', value));
    this._industry = [{text: 'surveyEvent.habitat.industry.true', value: true}, {text: 'surveyEvent.habitat.industry.false', value: false}];
    this._loop = Object.keys(Loop).filter(value => isNaN(Number(value))).map(value => this.createOption('loop', value));
    this._meadow = Object.keys(Meadow).filter(value => isNaN(Number(value))).map(value => this.createOption('meadow', value));
    this._shore = Object.keys(Shore).filter(value => isNaN(Number(value))).map(value => this.createOption('shore', value));
    this._slope = Object.keys(Slope).filter(value => isNaN(Number(value))).map(value => this.createOption('slope', value));
    this._trees = Object.keys(Trees).filter(value => isNaN(Number(value))).map(value => this.createOption('trees', value));
    this._soil = Object.keys(Soil).filter(value => isNaN(Number(value))).map(value => this.createOption('soil', value));
    this._bottlenecks = Object.keys(Bottleneck).filter(value => isNaN(Number(value))).map(value => this.createOption('bottleneck', value));
    this._vegetations = Object.keys(Vegetation).filter(value => isNaN(Number(value))).map(value => this.createOption('vegetation', value));
  }

  private createOption(x: string, value: string) : RadioOption<string> {
    const text = `surveyEvent.habitat.${x}.${value}`;
    return {value, text};
  }

  get waterLevels(): RadioOption<String>[] {
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

  get loop(): RadioOption<string>[] {
    return this._loop;
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

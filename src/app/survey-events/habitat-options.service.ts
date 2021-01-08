import {Injectable} from '@angular/core';
import {RadioOption} from "../shared-ui/radio-group/radioOption";
import {Agriculture, Bottleneck, Buildings, Loop, Meadow, Shelter, Shore, Slope, Soil, Trees, Vegetation, WaterLevel} from "./model/habitat";
import {TranslateService} from "@ngx-translate/core";
import {take} from "rxjs/operators";
import {CheckOption} from "../shared-ui/check-group/checkOption";

@Injectable({
  providedIn: 'root'
})
export class HabitatOptionsService {
  private _waterLevels: RadioOption[];
  private _shelters: RadioOption[];
  private _agriculture: RadioOption[];
  private _buildings: RadioOption[];
  private _loop: RadioOption[];
  private _meadow: RadioOption[];
  private _shore: RadioOption[];
  private _slope: RadioOption[];
  private _trees: RadioOption[];
  private _soil: CheckOption[];
  private _bottlenecks: CheckOption[];
  private _vegetations: CheckOption[];

  constructor(private translate: TranslateService) {
    this._waterLevels = Object.keys(WaterLevel).filter(value => isNaN(Number(value))).map(value => this.createOption("waterLevel", value))
    this._shelters = Object.keys(Shelter).filter(value => isNaN(Number(value))).map(value => this.createOption("shelter", value))
    this._agriculture = Object.keys(Agriculture).filter(value => isNaN(Number(value))).map(value => this.createOption("agriculture", value))
    this._buildings = Object.keys(Buildings).filter(value => isNaN(Number(value))).map(value => this.createOption("buildings", value))
    this._loop = Object.keys(Loop).filter(value => isNaN(Number(value))).map(value => this.createOption("loop", value))
    this._meadow = Object.keys(Meadow).filter(value => isNaN(Number(value))).map(value => this.createOption("meadow", value))
    this._shore = Object.keys(Shore).filter(value => isNaN(Number(value))).map(value => this.createOption("shore", value))
    this._slope = Object.keys(Slope).filter(value => isNaN(Number(value))).map(value => this.createOption("slope", value))
    this._trees = Object.keys(Trees).filter(value => isNaN(Number(value))).map(value => this.createOption("trees", value))
    this._soil = Object.keys(Soil).filter(value => isNaN(Number(value))).map(value => this.createOption("soil", value))
    this._bottlenecks = Object.keys(Bottleneck).filter(value => isNaN(Number(value))).map(value => this.createOption("bottleneck", value))
    this._vegetations = Object.keys(Vegetation).filter(value => isNaN(Number(value))).map(value => this.createOption("vegetation", value))
  }

  private createOption(x: string, value: string) {
    let text = undefined;
    const subscription = this.translate.get('surveyEvent.habitat.' + x + '.' + value).pipe(take(1)).subscribe(translated => text = translated);
    subscription.unsubscribe();
    let newVar = {value: value, text: text};
    return newVar;
  }

  get waterLevels(): RadioOption[] {
    return this._waterLevels;
  }

  get shelters(): RadioOption[] {
    return this._shelters;
  }

  get agriculture(): RadioOption[] {
    return this._agriculture;
  }

  get buildings(): RadioOption[] {
    return this._buildings;
  }

  get loop(): RadioOption[] {
    return this._loop;
  }

  get meadow(): RadioOption[] {
    return this._meadow;
  }

  get shore(): RadioOption[] {
    return this._shore;
  }

  get slope(): RadioOption[] {
    return this._slope;
  }

  get trees(): RadioOption[] {
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

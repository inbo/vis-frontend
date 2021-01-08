import {Injectable} from '@angular/core';
import {RadioOption} from "../shared-ui/radio-group/radioOption";
import {Agriculture, Buildings, Loop, Meadow, Shelter, Shore, Slope, Trees, WaterLevel} from "./model/habitat";
import {TranslateService} from "@ngx-translate/core";
import {take} from "rxjs/operators";

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

  constructor(private translate: TranslateService) {
    this._waterLevels = Object.keys(WaterLevel).filter(value => isNaN(Number(value))).map(value => this.createRadioOption("waterLevel", value))
    this._shelters = Object.keys(Shelter).filter(value => isNaN(Number(value))).map(value => this.createRadioOption("shelter", value))
    this._agriculture = Object.keys(Agriculture).filter(value => isNaN(Number(value))).map(value => this.createRadioOption("agriculture", value))
    this._buildings = Object.keys(Buildings).filter(value => isNaN(Number(value))).map(value => this.createRadioOption("buildings", value))
    this._loop = Object.keys(Loop).filter(value => isNaN(Number(value))).map(value => this.createRadioOption("loop", value))
    this._meadow = Object.keys(Meadow).filter(value => isNaN(Number(value))).map(value => this.createRadioOption("meadow", value))
    this._shore = Object.keys(Shore).filter(value => isNaN(Number(value))).map(value => this.createRadioOption("shore", value))
    this._slope = Object.keys(Slope).filter(value => isNaN(Number(value))).map(value => this.createRadioOption("slope", value))
    this._trees = Object.keys(Trees).filter(value => isNaN(Number(value))).map(value => this.createRadioOption("trees", value))
  }

  private createRadioOption(x: string, value: string) {
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
}

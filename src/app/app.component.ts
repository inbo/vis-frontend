import {Component} from '@angular/core';
import {AuthService} from "./core/auth.service";
import {TranslateService} from "@ngx-translate/core";
import {VisService} from "./vis.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private authService: AuthService, private translate: TranslateService, private visService: VisService) {
    this.authService.runInitialLoginSequence();

    visService.translations('nl').subscribe(value => {
      translate.setTranslation('nl', value, true);
    })

  }


}

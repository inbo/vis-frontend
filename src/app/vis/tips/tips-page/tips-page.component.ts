import {Component, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {take} from 'rxjs/operators';
import {TipsService} from '../../../services/vis.tips.service';
import {TranslateService} from '@ngx-translate/core';
import {Tip} from '../../../domain/tip/tip';
import {Subscription} from 'rxjs';

@Component({
    selector: 'vis-tips-page',
    templateUrl: './tips-page.component.html',
})
export class TipsPageComponent implements OnInit, OnDestroy {

    tips: Tip[];

    private subscription = new Subscription();

    constructor(private titleService: Title,
                private tipsService: TipsService,
                private activatedRoute: ActivatedRoute,
                private translateService: TranslateService) {
    }

    ngOnInit(): void {
        this.subscription.add(this.activatedRoute.params.subscribe(
            params => {
                this.getTips(params.tipPage);
            },
        ));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private getTips(tipPage: any) {
        this.tipsService
            .getPage(this.activatedRoute.snapshot.params.tipPage)
            .pipe(take(1))
            .subscribe(value => {
                this.titleService.setTitle(`Tips: ${this.translateService.instant(this.activatedRoute.snapshot.params.tipPage)}`);
                this.tips = value;
            });
    }
}

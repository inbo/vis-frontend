import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {Tip} from '../../domain/tip/tip';
import {map} from 'rxjs/operators';
import {TipsService} from '../../services/vis.tips.service';

@Component({
  selector: 'vis-tip',
  templateUrl: './tip.component.html'
})
export class TipComponent implements OnInit, OnDestroy {

  @Input()
  code: string;

  @Input()
  show: boolean;

  private subscription = new Subscription();

  tip$: Observable<Tip>;
  tipIsRead$: Observable<boolean>;

  constructor(private tipsService: TipsService) {
  }

  ngOnInit(): void {
    this.tip$ = this.tipsService.getTip(this.code);
    this.tipIsRead$ = this.tip$.pipe(map(tip => tip.read));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  hide() {
    this.show = false;
  }

  markAsRead() {
    this.subscription.add(this.tipsService.markTipAsRead(this.code).subscribe(_ => {
      this.show = false;
    }));
  }
}

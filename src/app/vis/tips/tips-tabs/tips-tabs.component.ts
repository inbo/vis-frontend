import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {TipsService} from '../../../services/vis.tips.service';

@Component({
  selector: 'app-tips-tabs',
  templateUrl: './tips-tabs.component.html'
})
export class TipsTabsComponent implements OnInit {

  tipPages$: Observable<string[]>;
  currentUrl: string;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private tipsService: TipsService) {
  }

  ngOnInit(): void {
    this.currentUrl = '/' + this.activatedRoute.snapshot.url.join('/');
    this.tipPages$ = this.tipsService.getPages();
  }

  navigate(location: string) {
    this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
      this.router.navigate([location]);
    });
  }
}

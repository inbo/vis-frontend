import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AsyncPage} from '../../../../shared-ui/paging-async/asyncPage';
import {Observable, of, Subscription} from 'rxjs';
import {Instance} from '../../../../domain/account/instance';
import {Title} from '@angular/platform-browser';
import {AccountService} from '../../../../services/vis.account.service';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../../../core/auth.service';
import {InstanceAddComponent} from '../instance-add/instance-add.component';

@Component({
  selector: 'app-instances-page',
  templateUrl: './instances-page.component.html'
})
export class InstancesPageComponent implements OnInit, OnDestroy {

  @ViewChild(InstanceAddComponent) instanceAddComponent;

  loading = false;

  pager: AsyncPage<Instance>;
  instances: Observable<Instance[]>;

  private subscription = new Subscription();

  constructor(private titleService: Title, private accountService: AccountService, private activatedRoute: ActivatedRoute,
              public authService: AuthService) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Instanties');

    this.subscription.add(
      this.activatedRoute.queryParams.subscribe((params) => {
        this.getInstances(params.page ? params.page : 1, params.size ? params.size : 20);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getInstances(page: number, size: number) {
    this.loading = true;
    this.instances = of([]);
    this.subscription.add(
      this.accountService.getInstances(page, size).subscribe((value) => {
        this.pager = value;
        this.instances = of(value.content);
        this.loading = false;
      })
    );
  }

  addInstance() {
    this.instanceAddComponent.open();
  }
}

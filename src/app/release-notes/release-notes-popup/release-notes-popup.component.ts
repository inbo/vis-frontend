import {Component, OnDestroy, OnInit} from '@angular/core';
import {ResolveEnd, Router} from '@angular/router';
import {VisService} from '../../vis.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-release-notes-popup',
  templateUrl: './release-notes-popup.component.html'
})
export class ReleaseNotesPopupComponent implements OnInit, OnDestroy {
  showReleaseNotes: boolean;
  currentReleaseNotes: string;

  private subscription = new Subscription();

  constructor(private visService: VisService, private router: Router) {
  }

  ngOnInit(): void {
    this.subscription.add(
      this.router.events.subscribe(async (routerData) => {
        if (routerData instanceof ResolveEnd) {
          this.showReleaseNotes = !['/', ''].includes(routerData.url.split('?')[0])
            && !routerData.url.startsWith('/releases') && !await this.visService.hasUserReadLatestReleaseNotes().toPromise();
          if (this.showReleaseNotes) {
            this.visService.getCurrentRelease().subscribe(value => this.currentReleaseNotes = value);
          }
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  read(): void {
    this.subscription.add(
      this.visService.userReadLatestReleaseNotes().subscribe(() => this.showReleaseNotes = false)
    );
  }
}

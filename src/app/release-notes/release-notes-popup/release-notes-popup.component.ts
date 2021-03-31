import {Component, OnDestroy, OnInit} from '@angular/core';
import {ResolveEnd, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {ReleaseNotesService} from '../../services/vis.release-notes.service';

const EXCLUDE_URLS = ['', 'forbidden', 'not-found', 'internal-server-error', 'service-unavailable'];

@Component({
  selector: 'app-release-notes-popup',
  templateUrl: './release-notes-popup.component.html'
})
export class ReleaseNotesPopupComponent implements OnInit, OnDestroy {
  showReleaseNotes: boolean;
  currentReleaseNotes: string;

  private subscription = new Subscription();

  constructor(private releaseNotesService: ReleaseNotesService, private router: Router) {
  }

  ngOnInit(): void {
    this.subscription.add(
      this.router.events.subscribe(async (routerData) => {
        if (routerData instanceof ResolveEnd) {
          const path = routerData.url.split('?')[0].replace('/', '');
          this.showReleaseNotes = this.router.config.map(value => value.path).includes(path) &&
            !EXCLUDE_URLS.includes(path) &&
            !routerData.url.startsWith('/releases') &&
            !await this.releaseNotesService.hasUserReadLatestReleaseNotes().toPromise();
          if (this.showReleaseNotes) {
            this.subscription.add(this.releaseNotesService.getCurrentRelease().subscribe(value => this.currentReleaseNotes = value));
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
      this.releaseNotesService.userReadLatestReleaseNotes().subscribe(() => this.showReleaseNotes = false)
    );
  }
}

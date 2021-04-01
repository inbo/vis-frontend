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
          // Get first part of current path without query parameters
        const path = routerData.url.split('?')[0].replace('/', '').split('/')[0];
          // Get first part of configured router paths
          const routerPaths = this.router.config.map(value => value.path.split('/')[0]);
          // Check if the user has already read the release notes
          // and if the current url is in the configured router paths, but not in the releases or error paths
          this.showReleaseNotes = routerPaths.includes(path) &&
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

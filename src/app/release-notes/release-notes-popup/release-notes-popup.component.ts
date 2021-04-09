import {Component, OnDestroy, OnInit} from '@angular/core';
import {ResolveEnd, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {ReleaseNotesService} from '../../services/vis.release-notes.service';
import {take} from "rxjs/operators";

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
      this.router.events.subscribe((routerData => {
          if (routerData instanceof ResolveEnd) {
            this.releaseNotesService.hasUserReadLatestReleaseNotes().pipe(take(1)).subscribe(hasUserReadLatestReleaseNotes => {
              // Get first part of current path without query parameters
              const path = routerData.url.split('?')[0].replace('/', '').split('/')[0];
              // Get first part of configured router paths
              const routerPaths = this.router.config.map(value => value.path.split('/')[0]);
              // Check if the user has already read the release notes
              // and if the current url is in the configured router paths, but not in the releases or error paths
              this.showReleaseNotes = routerPaths.includes(path) &&
                !EXCLUDE_URLS.includes(path) &&
                !routerData.url.startsWith('/releases') &&
                !hasUserReadLatestReleaseNotes;
              if (this.showReleaseNotes) {
                this.releaseNotesService.getCurrentRelease().pipe(take(1)).subscribe(value => this.currentReleaseNotes = value);
              }
            })
          }
        })
      ));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  read(): void {
    this.releaseNotesService.userReadLatestReleaseNotes().pipe(take(1)).subscribe(() => this.showReleaseNotes = false);
  }
}

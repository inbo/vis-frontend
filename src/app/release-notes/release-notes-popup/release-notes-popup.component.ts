import {Component, OnInit} from '@angular/core';
import {ResolveEnd, Router} from '@angular/router';
import {VisService} from '../../vis.service';

@Component({
  selector: 'release-notes-popup',
  templateUrl: './release-notes-popup.component.html'
})
export class ReleaseNotesPopupComponent implements OnInit {
  showReleaseNotes: boolean;
  currentReleaseNotes: string;
  private hasUserReadLatestReleaseNotes: boolean;

  constructor(private visService: VisService, private router: Router) {
    this.visService.getCurrentRelease().subscribe(value => this.currentReleaseNotes = value)
  }

  ngOnInit(): void {
    this.router.events.subscribe(async (routerData) => {
      if (routerData instanceof ResolveEnd) {
        this.hasUserReadLatestReleaseNotes = this.hasUserReadLatestReleaseNotes ? this.hasUserReadLatestReleaseNotes : await this.visService.hasUserReadLatestReleaseNotes().toPromise();
        this.showReleaseNotes = routerData.url !== '/' && !routerData.url.startsWith('/releases') && !this.hasUserReadLatestReleaseNotes
      }
    })
  }

  read(): void {
    this.visService.userReadLatestReleaseNotes().subscribe(value => this.showReleaseNotes = false)
  }
}

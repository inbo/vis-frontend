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

  constructor(private visService: VisService, private router: Router) {
  }

  ngOnInit(): void {
    this.router.events.subscribe(async (routerData) => {
      if (routerData instanceof ResolveEnd) {
        this.showReleaseNotes = !['/', ''].includes(routerData.url.split('?')[0])
          && !routerData.url.startsWith('/releases') && !await this.visService.hasUserReadLatestReleaseNotes().toPromise()
        if (this.showReleaseNotes) {
          this.visService.getCurrentRelease().subscribe(value => this.currentReleaseNotes = value)
        }
      }
    })
  }

  read(): void {
    this.visService.userReadLatestReleaseNotes().subscribe(value => this.showReleaseNotes = false)
  }
}

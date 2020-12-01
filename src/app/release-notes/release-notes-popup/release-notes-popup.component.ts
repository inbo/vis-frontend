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
    this.visService.getLatestRelease().subscribe(value => this.currentReleaseNotes = value)
  }

  ngOnInit(): void {
    this.router.events.subscribe(async (routerData) => {
      if (routerData instanceof ResolveEnd) {
        this.showReleaseNotes = routerData.url !== '/' && routerData.url !== '/releases' && await this.visService.hasUserReadLatestReleaseNotes().toPromise()
      }
    })
  }

  read(): void {
    this.showReleaseNotes = false;
  }
}

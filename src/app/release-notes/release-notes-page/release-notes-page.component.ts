import {Component, OnInit} from '@angular/core';
import {NavigationLink} from '../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../GlobalConstants';
import {BreadcrumbLink} from '../../shared-ui/breadcrumb/BreadcrumbLinks';
import {VisService} from '../../vis.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'release-notes-page',
  templateUrl: './release-notes-page.component.html'
})
export class ReleaseNotesPageComponent implements OnInit {
  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Release notes', url: '/releases'}
  ]
  releaseAsHtml: string;
  releases: string[];
  private currentRelease: string;

  constructor(private visService: VisService, private activatedRoute: ActivatedRoute, private router: Router) {
    this.activatedRoute.params.subscribe(res => {
      if (!res.release || res.release !== this.currentRelease) {
        this.loadReleases()
        this.currentRelease = res.release
      }
    })
  }

  ngOnInit(): void {
  }

  loadReleases() {
    const release = this.activatedRoute.snapshot.params.release;
    if (!release) {
      this.visService.getLatestReleaseVersion().subscribe(value => {
        this.router.navigate(['/releases/' + value]);
      })
    } else {
      this.visService.getReleases(release).subscribe(value => {
        this.releaseAsHtml = value.releaseAsHtml;
        this.releases = value.releaseVersions.reverse();
      })
    }
  }

}

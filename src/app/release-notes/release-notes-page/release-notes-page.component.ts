import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationLink} from '../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../GlobalConstants';
import {BreadcrumbLink} from '../../shared-ui/breadcrumb/BreadcrumbLinks';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {ReleaseNotesService} from '../../services/vis.release-notes.service';

@Component({
  selector: 'app-release-notes-page',
  templateUrl: './release-notes-page.component.html'
})
export class ReleaseNotesPageComponent implements OnInit, OnDestroy {
  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Release notes', url: '/releases'}
  ];
  releaseAsHtml: string;
  releases: string[];
  private currentRelease: string;
  private subscription = new Subscription();

  constructor(private releaseNotesService: ReleaseNotesService, private activatedRoute: ActivatedRoute, private router: Router) {
    this.subscription.add(
      this.activatedRoute.params.subscribe(res => {
        if (!res.release || res.release !== this.currentRelease) {
          this.loadReleases();
          this.currentRelease = res.release;
        }
      })
    );
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  loadReleases() {
    const release = this.activatedRoute.snapshot.params.release;
    if (!release) {
      this.subscription.add(
        this.releaseNotesService.getLatestRelease().subscribe(value => {
          this.router.navigate(['/releases/' + value]);
        })
      );
    } else {
      this.subscription.add(
        this.releaseNotesService.getReleases(release).subscribe(value => {
          this.releaseAsHtml = value.releaseAsHtml;
          this.releases = value.releaseVersions.reverse();
        })
      );
    }
  }

}

import {Component, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {TandemvaultPicture, TandemvaultPictureDetail} from '../../../domain/tandemvault/picture';
import {PicturesService} from '../../../services/vis.pictures.service';
import {AsyncPage} from '../../../shared-ui/paging-async/asyncPage';
import {Subscription} from 'rxjs';
import {ProjectService} from '../../../services/vis.project.service';
import {Project} from '../../../domain/project/project';

@Component({
  selector: 'app-project-pictures-page',
  templateUrl: './project-pictures-page.component.html'
})
export class ProjectPicturesPageComponent implements OnInit, OnDestroy {
  loading = false;

  pager: AsyncPage<TandemvaultPicture>;
  pictures: TandemvaultPicture[];

  detail: TandemvaultPictureDetail;
  selectedPicture: TandemvaultPicture;

  subscription = new Subscription();
  projectCode: string;
  tandemvaultcollectionslug: string;

  constructor(private titleService: Title, private activatedRoute: ActivatedRoute,
              private picturesService: PicturesService, private projectService: ProjectService) {
    this.projectCode = this.activatedRoute.snapshot.parent.params.projectCode;
    this.titleService.setTitle(`Project ${this.projectCode} afbeeldingen`);

    this.projectService.getProject(this.projectCode).subscribe(value => {
      this.tandemvaultcollectionslug = value.tandemvaultcollectionslug;
    });

    this.loadPicturesPage();

    this.subscription.add(
      this.activatedRoute.queryParams.subscribe((params) => {
          this.loadPicturesPage();
        }
      ));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {

  }

  openDetail(picture: TandemvaultPicture) {
    this.selectedPicture = picture;
    this.picturesService.getPicture(picture.id).subscribe(value => {
      this.detail = value;
    });
  }

  download(id: any) {
    this.picturesService.downloadPicture(id).subscribe(value => {
      window.open(value.url, '_blank');
    });
  }

  loadPicturesPage() {
    this.loading = true;
    this.pictures = [];
    const page = this.activatedRoute.snapshot.queryParams.page;
    this.subscription.add(
      this.picturesService.getPictures(page, this.projectCode).subscribe((value) => {
        this.pager = value;
        this.pictures = value.content;
        this.loading = false;
        this.selectedPicture = this.pictures[0];
        this.openDetail(this.selectedPicture);
      })
    );
  }
}

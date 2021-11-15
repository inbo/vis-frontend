import {Component, OnDestroy, OnInit} from '@angular/core';
import {AsyncPage} from '../../../../shared-ui/paging-async/asyncPage';
import {TandemvaultPicture, TandemvaultPictureDetail} from '../../../../domain/tandemvault/picture';
import {Subscription} from 'rxjs';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {PicturesService} from '../../../../services/vis.pictures.service';
import {ProjectService} from '../../../../services/vis.project.service';

@Component({
  selector: 'app-gallery-page',
  templateUrl: './gallery-page.component.html'
})
export class GalleryPageComponent implements OnInit, OnDestroy {
  loading = false;

  pager: AsyncPage<TandemvaultPicture>;
  pictures: TandemvaultPicture[];

  detail: TandemvaultPictureDetail;
  selectedPicture: TandemvaultPicture;

  subscription = new Subscription();
  projectCode: string;
  surveyEventId: number;
  url: string;
  tandemvaultcollectionslug: string;

  constructor(private titleService: Title, private activatedRoute: ActivatedRoute,
              private picturesService: PicturesService, private projectService: ProjectService) {
    this.projectCode = this.activatedRoute.snapshot.parent.parent.params.projectCode;
    this.surveyEventId = this.activatedRoute.snapshot.parent.parent.params.surveyEventId;
    this.url = this.activatedRoute.snapshot.data.url;
    this.titleService.setTitle(`Waarneming afbeeldingen`);

    this.projectService.getProject(this.projectCode).subscribe(value => {
      this.tandemvaultcollectionslug = value.tandemvaultcollectionslug;
    });

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
    this.loadDetailPicture(picture.id);
  }

  private loadDetailPicture(id: number) {
    this.picturesService.getPicture(id).subscribe(value => {
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

    if (this.url === 'afbeeldingen') {
      this.subscription.add(
        this.picturesService.getPicturesForSurveyEvent(page, this.projectCode, this.surveyEventId).subscribe((value) => {
          this.afterLoadPictures(value);
        })
      );
    } else if (this.url === 'project') {
      this.subscription.add(
        this.picturesService.getPictures(page, this.projectCode).subscribe((value) => {
          this.afterLoadPictures(value);
        })
      );
    } else if (this.url === 'dag') {
      this.subscription.add(
        this.picturesService.getPicturesForSurveyEvent(page, this.projectCode, this.surveyEventId).subscribe((value) => {
          this.afterLoadPictures(value);
        })
      );
    }

  }

  private afterLoadPictures(value: AsyncPage<TandemvaultPicture>) {
    this.pager = value;
    this.pictures = value.content;
    this.loading = false;
    this.selectedPicture = this.pictures[0];
    this.openDetail(this.selectedPicture);
  }

  addTags(assetId: number) {
    this.subscription.add(
      this.picturesService.addTagsForSurveyEvent(assetId, this.projectCode, this.surveyEventId).subscribe(value => {
        this.loadDetailPicture(assetId);
      })
    );
  }

  removeTags(assetId: number) {
    this.subscription.add(
      this.picturesService.clearTagsForSurveyEvent(assetId, this.projectCode, this.surveyEventId).subscribe(value => {
        this.loadDetailPicture(assetId);
      })
    );
  }

  clearTags(assetId: number) {
    this.subscription.add(
      this.picturesService.clearTagsForSurveyEvent(assetId, this.projectCode, this.surveyEventId).subscribe(value => {
        this.loadDetailPicture(assetId);
      })
    );
  }

  customTagAdded(event: any) {
    this.picturesService.addCustomTag(event.assetId, this.projectCode, this.surveyEventId, event.tag).subscribe(value => {
      this.loadDetailPicture(event.assetId);
    });
  }

  speciesTagAdded(event: any) {
    this.picturesService.addSpeciesTag(event.assetId, this.projectCode, this.surveyEventId, event.taxonId).subscribe(value => {
      this.loadDetailPicture(event.assetId);
    });
  }

  removeTag(event: any) {
    this.subscription.add(
      this.picturesService.deleteTag(event.assetId, this.projectCode, this.surveyEventId, event.tag).subscribe(value => {
        this.loadDetailPicture(event.assetId);
      })
    );
  }
}

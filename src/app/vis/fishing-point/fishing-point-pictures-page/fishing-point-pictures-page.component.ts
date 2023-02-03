import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AsyncPage} from '../../../shared-ui/paging-async/asyncPage';
import {TandemvaultPicture, TandemvaultPictureDetail} from '../../../domain/tandemvault/picture';
import {Title} from '@angular/platform-browser';
import {TaxaService} from '../../../services/vis.taxa.service';
import {ActivatedRoute} from '@angular/router';
import {PicturesService} from '../../../services/vis.pictures.service';

@Component({
  selector: 'vis-fishing-point-pictures-page',
  templateUrl: './fishing-point-pictures-page.component.html'
})
export class FishingPointPicturesPageComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();

  loading = false;

  pager: AsyncPage<TandemvaultPicture>;
  pictures: TandemvaultPicture[] = [];

  detail: TandemvaultPictureDetail;
  selectedPicture: TandemvaultPicture;

  constructor(private titleService: Title, private taxaService: TaxaService, private activatedRoute: ActivatedRoute,
              private picturesService: PicturesService) {
    this.loadPicturesPage();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
    const fishingPointCode = this.activatedRoute.parent.snapshot.params.code;
    this.subscription.add(
      this.picturesService.getPicturesByTag(page, 'vis:meetplaatscode:' + fishingPointCode.toLowerCase()).subscribe((value) => {
        this.pager = value;
        this.pictures = value.content;
        this.loading = false;
        if (value.content.length > 0) {
          this.selectedPicture = this.pictures[0];
          this.openDetail(this.selectedPicture);
        }

      })
    );
  }

}

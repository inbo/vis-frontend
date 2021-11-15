import {Component, OnDestroy, OnInit} from '@angular/core';
import {AsyncPage} from '../../../shared-ui/paging-async/asyncPage';
import {TandemvaultPicture, TandemvaultPictureDetail} from '../../../domain/tandemvault/picture';
import {Title} from '@angular/platform-browser';
import {TaxaService} from '../../../services/vis.taxa.service';
import {ActivatedRoute} from '@angular/router';
import {PicturesService} from '../../../services/vis.pictures.service';
import {Subscription} from 'rxjs';
import {TaxonDetail} from '../../../domain/taxa/taxon-detail';

@Component({
  selector: 'app-fish-species-pictures-page',
  templateUrl: './fish-species-pictures-page.component.html'
})
export class FishSpeciesPicturesPageComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();

  loading = false;

  pager: AsyncPage<TandemvaultPicture>;
  pictures: TandemvaultPicture[] = [];

  detail: TandemvaultPictureDetail;
  selectedPicture: TandemvaultPicture;
  private taxon: TaxonDetail;

  constructor(private titleService: Title, private taxaService: TaxaService, private activatedRoute: ActivatedRoute,
              private picturesService: PicturesService) {
    this.taxaService.getTaxon(this.activatedRoute.parent.snapshot.params.taxonId).subscribe(taxon => {
      this.taxon = taxon;
      this.subscription.add(
        this.activatedRoute.queryParams.subscribe((params) => {
            this.loadPicturesPage();
          }
        ));
    });
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
    this.subscription.add(
      this.picturesService.getPicturesByTag(page, 'vis:taxon:' + this.taxon.nameDutch).subscribe((value) => {
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

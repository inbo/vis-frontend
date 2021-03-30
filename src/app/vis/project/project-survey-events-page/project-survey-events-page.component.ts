import {Component, OnDestroy, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {Observable, of, Subscription} from 'rxjs';
import {AsyncPage} from '../../../shared-ui/paging-async/asyncPage';
import {SurveyEvent} from '../../../domain/survey-event/surveyEvent';
import {SurveyEventsService} from '../../../services/vis.surveyevents.service';

@Component({
  selector: 'app-project-survey-events-page',
  templateUrl: './project-survey-events-page.component.html'
})
export class ProjectSurveyEventsPageComponent implements OnInit, OnDestroy {

  loading = false;
  pager: AsyncPage<SurveyEvent>;
  surveyEvents: Observable<SurveyEvent[]>;

  private subscription = new Subscription();
  private projectCode: string;

  constructor(private titleService: Title, private surveyEventsService: SurveyEventsService, private activatedRoute: ActivatedRoute) {
    this.titleService.setTitle(`Waarnemingen voor ${this.activatedRoute.parent.snapshot.params.projectCode}`);
    this.projectCode = this.activatedRoute.parent.snapshot.params.projectCode;

    this.subscription.add(
      this.activatedRoute.queryParams.subscribe((params) => {
        this.getSurveyEvents(params.page ? params.page : 1, params.size ? params.size : 20);
      })
    );

  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getSurveyEvents(page: number, size: number) {

    const queryParams = this.activatedRoute.snapshot.queryParams;

    const currentPage = this.pager?.pageable.pageNumber + 1;
    const newPage = queryParams.page ? queryParams.page : 1;

    if (this.pager === undefined || currentPage !== parseInt(newPage, 10)) {
      this.loading = true;
      this.surveyEvents = of([]);

      this.subscription.add(
        this.surveyEventsService.getSurveyEvents(this.activatedRoute.parent.snapshot.params.projectCode, page, size).subscribe((value) => {
          this.pager = value;
          this.surveyEvents = of(value.content);
          this.loading = false;
        })
      );
    }
  }
}

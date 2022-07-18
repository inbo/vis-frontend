import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SurveyEventsService} from '../../../services/vis.surveyevents.service';
import {take, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {DatepickerComponent} from '../../../shared-ui/datepicker/datepicker.component';
import {uniqueNewValidator} from '../survey-event-validators';
import {SearchableSelectOption} from '../../../shared-ui/searchable-select/SearchableSelectOption';
import {Method} from '../../../domain/method/method';
import {MethodsService} from '../../../services/vis.methods.service';
import {SearchableSelectConfigBuilder} from '../../../shared-ui/searchable-select/SearchableSelectConfig';

@Component({
    selector: 'app-survey-event-copy-modal',
    templateUrl: './survey-event-copy-modal.component.html',
})
export class SurveyEventCopyModalComponent implements OnInit, AfterViewInit {

    @ViewChild('occurrenceDatePicker') occurrenceDatePicker: DatepickerComponent;

    @Input() projectCode;
    @Input() surveyEventId;
    @Input() startDate: Date;
    @Input() endDate: Date;
    @Input() location: number;
    @Input() method: string;

    isOpen = false;
    copySurveyEventForm: FormGroup;
    submitted = false;

    allMethods: Array<Method> = [];
    filteredMethods: SearchableSelectOption[] = [];
    methodSearchConfiguration = new SearchableSelectConfigBuilder().minQueryLength(0).build();

    constructor(private formBuilder: FormBuilder, private surveyEventsService: SurveyEventsService,
                private router: Router, private methodsService: MethodsService) {
    }

    ngOnInit(): void {
        if (!this.projectCode || !this.surveyEventId) {
            throw new Error('Attributes "projectCode" and "surveyEventId" are required');
        }

        this.getAllMethods();

        this.copySurveyEventForm = this.formBuilder.group(
            {
                occurrenceDate: [null, [Validators.required]],
                method: [null],
            }, {asyncValidators: [uniqueNewValidator(this.projectCode, this.location, this.method, this.surveyEventsService)]});
    }

    ngAfterViewInit(): void {
        this.occurrenceDatePicker.setMinDate(new Date(this.startDate));
        // Set max date to today's date or to survey end date
        this.occurrenceDatePicker.setMaxDate(this.endDate ? new Date(this.endDate) > new Date() ? new Date() : new Date(this.endDate) :
            new Date());
    }

    open() {
        this.isOpen = true;
    }

    get occurrenceDate() {
        return this.copySurveyEventForm.get('occurrenceDate');
    }

    copySurveyEvent() {
        this.submitted = true;

        if (this.copySurveyEventForm.invalid) {
            return;
        }

        this.surveyEventsService.copySurveyEvent(this.projectCode, this.surveyEventId, this.copySurveyEventForm.getRawValue())
            .pipe(take(1))
            .subscribe((surveyEvent) => {
                this.isOpen = false;
                this.router.navigate(['projecten', this.projectCode,
                    'waarnemingen', surveyEvent.surveyEventId]).then(() => window.location.reload());
            });
    }

    private getAllMethods(): void {
        this.methodsService.getAllMethods()
            .pipe(
                take(1),
                tap(methods => this.allMethods = methods),
                tap(() => this.filterMethods('')),
            ).subscribe();
    }

    filterMethods(query: string): void {
        query = query.toLowerCase();
        this.filteredMethods = this.allMethods
            .filter(method =>
                method.code.toLowerCase().includes(query)
                || method.description.toLowerCase().includes(query))
            .map(method => ({
                selectValue: method.code,
                option: method,
            }));
    }
}

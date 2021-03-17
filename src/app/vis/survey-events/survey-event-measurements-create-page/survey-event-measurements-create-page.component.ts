import {Component, OnInit} from '@angular/core';
import {NavigationLink} from '../../../shared-ui/layouts/NavigationLinks';
import {GlobalConstants} from '../../../GlobalConstants';
import {BreadcrumbLink} from '../../../shared-ui/breadcrumb/BreadcrumbLinks';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-survey-event-measurements-create-page',
  templateUrl: './survey-event-measurements-create-page.component.html'
})
export class SurveyEventMeasurementsCreatePageComponent implements OnInit {

  links: NavigationLink[] = GlobalConstants.links;
  breadcrumbLinks: BreadcrumbLink[] = [
    {title: 'Projecten', url: '/projecten'},
    {title: this.activatedRoute.snapshot.params.projectCode, url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode},
    {title: 'Waarnemingen', url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode + '/waarnemingen'},
    {
      title: this.activatedRoute.snapshot.params.surveyEventId,
      url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode + '/waarnemingen/'
        + this.activatedRoute.snapshot.params.surveyEventId
    },
    {
      title: 'Metingen',
      url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode + '/waarnemingen/'
        + this.activatedRoute.snapshot.params.surveyEventId + '/metingen'
    },
    {
      title: 'Toevoegen',
      url: '/projecten/' + this.activatedRoute.snapshot.params.projectCode + '/waarnemingen/'
        + this.activatedRoute.snapshot.params.surveyEventId + '/metingen/toevoegen'
    }
  ];

  private currentNumber = 1;

  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    const commentField = document.getElementById('commentField');
    const listener = event => {
      if (event.keyCode === 9) {
        event.preventDefault();

        document.getElementById('table').innerHTML +=
          '<tr>' +
          ' <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">' +
          '   <input id="soort' + this.currentNumber + '" type="text" class="max-w-lg block w-full shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md" />' +
          ' </td>' +
          ' <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">' +
          '   <input type="text" class="max-w-lg block w-full shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md" />' +
          ' </td>' +
          ' <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">' +
          '   <input type="text" class="max-w-lg block w-full shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md" />' +
          ' </td>' +
          ' <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">' +
          '   <input type="text" class="max-w-lg block w-full shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md" />' +
          ' </td>' +
          ' <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">' +
          '   <input type="text" class="max-w-lg block w-full shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md" />' +
          ' </td>' +
          ' <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">' +
          '   <input type="text" class="max-w-lg block w-full shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md" />' +
          ' </td>' +
          ' <td id="commentField' + this.currentNumber + '" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">' +
          '   <input type="text" class="max-w-lg block w-full shadow-sm focus:ring-pink-500 focus:border-pink-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md" />' +
          ' </td>' +
          '</tr>';

        // Focus new 'soort' field
        document.getElementById(`soort${this.currentNumber}`).focus();
        // Remove listener from previous comment field
        commentField.removeEventListener('keydown', listener);
        // Add listener to new comment field
        document.getElementById(`commentField${this.currentNumber++}`).addEventListener('keydown', listener);
      }
    };
    commentField.addEventListener('keydown', listener);
  }

}

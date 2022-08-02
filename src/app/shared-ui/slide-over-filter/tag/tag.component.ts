import {Component, Input} from '@angular/core';
import {Tag} from '../tag';

@Component({
    selector: 'app-tag',
    templateUrl: './tag.component.html',
})
export class TagComponent {

    @Input() tag: Tag;
}

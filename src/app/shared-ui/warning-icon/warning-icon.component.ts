import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {NgxTippyProps} from 'ngx-tippy-wrapper';

@Component({
    selector: 'vis-warning-icon',
    templateUrl: 'warning-icon.component.html',
    styleUrls: ['warning-icon.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WarningIconComponent {

    @Input() messages: Array<string>;

    tippyProps: NgxTippyProps = {
        maxWidth: Infinity,
    };

}

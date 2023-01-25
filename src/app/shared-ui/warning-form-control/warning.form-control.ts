import {FormControl} from '@angular/forms';
import {isNil} from 'lodash-es';

export class WarningFormControl extends FormControl {
    warningMessages: { [key: string]: string } = {};

    getAllWarningMessages(): Array<string> {
        if (isNil(this.warningMessages)) {
            return [];
        }

        return Object.values(this.warningMessages);
    }

    hasWarningMessages(): boolean {
        return this.getAllWarningMessages().length > 0;
    }
}

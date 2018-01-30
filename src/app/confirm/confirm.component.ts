import {Component} from '@angular/core';
import {DialogComponent, DialogService} from 'ng2-bootstrap-modal';


@Component({
    selector: 'app-confirm',
    styleUrls: ['./confirm.component.css'],
    templateUrl: './confirm.component.html'
})

export class ConfirmComponent extends DialogComponent<null, boolean> {

    constructor(dialogService: DialogService) {
        super(dialogService);
    }

    fireEvent(event) {
        this.result = event === 'save';
        this.close();
    }
}


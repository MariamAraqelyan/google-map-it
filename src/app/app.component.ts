import {Component, OnInit} from '@angular/core';
import {ConfirmComponent} from './confirm/confirm.component';
import {DialogService} from 'ng2-bootstrap-modal';

@Component({
    selector: 'app-map',
    styleUrls: ['app.component.css'],
    templateUrl: 'app.component.html'
})

export class AppComponent implements OnInit {

    public markerAddress: any;

    constructor(private dialogService: DialogService) {
    }


    ngOnInit() {
        this.markerAddress = JSON.parse(localStorage.getItem('historyData'));
    }

    showConfirm() {
        this.dialogService.addDialog(ConfirmComponent, {
            title: 'Map selection tool'
        })
            .subscribe((isConfirmed) => {
                if (isConfirmed) {
                    this.markerAddress = JSON.parse(localStorage.getItem('historyData'));
                }
            });
    }

    addNew() {
        this.dialogService.addDialog(ConfirmComponent, {
            title: 'Map selection tool'
        });
    }
}

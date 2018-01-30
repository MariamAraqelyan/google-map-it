import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { ConfirmComponent } from './confirm/confirm.component';
import { FormsModule } from '@angular/forms';

import {AppComponent} from './app.component';
 import { GoogleMapComponent } from './google-map/google-map.component';

@NgModule({
    declarations: [
        AppComponent,
        ConfirmComponent,
        GoogleMapComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        BootstrapModalModule
    ],
    entryComponents: [
      ConfirmComponent
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}

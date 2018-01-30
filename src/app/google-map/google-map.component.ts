import {Component, ElementRef, EventEmitter, NgZone, OnInit, Output, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {} from '@types/googlemaps';
declare let google: any;


@Component({
    selector: 'app-google-map',
    templateUrl: './google-map.component.html',
    styleUrls: ['./google-map.component.css']
})
export class GoogleMapComponent implements OnInit {
    public map: any;
    public address: any;
    public latitude: number;
    public longitude: number;
    public activebutton: boolean;
    public place: any;
    public all_overlays = [];
    public historyData = [];
    public drawingManager: google.maps.drawing.DrawingManager;
    public drawingManagers: google.maps.drawing.DrawingManager[] = [];
    public searchControl: FormControl;
    public autocomplete: google.maps.places.Autocomplete;
    public marker: google.maps.Marker;
    public area: number;
    public markers: google.maps.Marker[] = [];

    @ViewChild('search')
    public searchElement: ElementRef;

    @Output() confirm: EventEmitter<any> = new EventEmitter();

    constructor(private ngZone: NgZone) {
    }


    ngOnInit() {
        this.searchControl = new FormControl();
        this.map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 20, lng: 44},
            zoom: 12
        });
        this.autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, {types: ['address']});

        this.autocomplete.addListener('place_changed', () => {
            this.ngZone.run(() => {
                this.place = this.autocomplete.getPlace();
                if (this.place.geometry === undefined || this.place.geometry === null) {
                    return;
                }
                const center = {
                    lat: this.place.geometry.location.lat(),
                    lng: this.place.geometry.location.lng()
                };
                this.address = this.place.formatted_address;
                this.latitude = this.place.geometry.location.lat();
                this.longitude = this.place.geometry.location.lng();
                this.map.setCenter(center);
                this.removeDrawables();
                this.removeMarkers();
                this.setMarker(center);
                this.setDrawable();

            });
        });
    }

    addMarker() {
        this.historyData.push({
                address: this.address,
                latitude: this.latitude,
                longitude: this.longitude,
                area: this.area
            }
        );
        let storedData: any[] = <any[]>JSON.parse(localStorage.getItem('historyData'));
        if (storedData) {
            storedData.push(...this.historyData);
        } else {
            storedData = this.historyData;
        }
        localStorage.setItem('historyData', JSON.stringify(storedData));
        this.confirm.next('save');

    }

    private setDrawable() {
        this.drawingManager = new google.maps.drawing.DrawingManager({
            drawingMode: google.maps.drawing.OverlayType.POLYGON,
            drawingControl: false,
            drawingControlOptions: {
                position: google.maps.ControlPosition.TOP_CENTER,
                drawingModes: []
            }
        });
        this.drawingManager.setMap(this.map);
        this.drawingManagers.push(this.drawingManager);
        google.maps.event.addListener(this.drawingManager, 'overlaycomplete', (event) => {
            this.ngZone.run(() => {
                this.all_overlays.push(event);
                if (event.type === google.maps.drawing.OverlayType.POLYGON) {
                    this.area = Math.floor(google.maps.geometry.spherical.computeArea(event.overlay.getPath())) / 1000;
                    const contentString = `Area: ${this.area} m/sqr`;
                    const infoWindow = new google.maps.InfoWindow({
                        content: contentString
                    });
                    infoWindow.open(this.map, <google.maps.MVCObject>this.marker);
                }

                this.drawingManager.setDrawingMode(null);
                this.removeDrawables();
                this.activebutton = true;
            });
        });
    }

    private setMarker(center: any = []) {

        this.marker = new google.maps.Marker({
            map: this.map,
            draggable: false,
            animation: google.maps.Animation.DROP,
            position: center
        });
        this.markers.push(this.marker);

    }

    private removeDrawables() {
        const drawables: google.maps.drawing.DrawingManager[] = this.drawingManagers;
        drawables.forEach(drawable => {
            drawable.setMap(null);
        });
        this.drawingManagers = [];
    }

    private  removeOverlay() {
        for (let i = 0; i < this.all_overlays.length; i++) {
            this.all_overlays[i].overlay.setMap(null);
        }
        this.all_overlays = [];
    }

    private removeMarkers() {
        this.removeOverlay();
        this.setDrawable();
        this.activebutton = false;
    }

}

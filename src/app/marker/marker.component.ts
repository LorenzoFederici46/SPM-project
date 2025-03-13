import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ImgServiceService } from 'src/service/img.service';
import * as Leaflet from 'leaflet';
import { AuthenticationService } from 'src/service/auth.service';

Leaflet.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/images/marker-icon-2x.png',
  iconUrl: 'assets/images/marker-icon.png',
  shadowUrl: 'assets/images/marker-shadow.png'
});

@Component({
  selector: 'app-marker',
  templateUrl: './marker.component.html',
  styleUrls: ['./marker.component.css']
})
export class MarkerComponent implements OnInit {

  public posts: any[] = [];
  map!: Leaflet.Map;
  markers: Leaflet.Marker[] = [];
  public initialMarkers: any[] = [];

  options = {
    layers: [
      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
    ],
    zoom: 16,
    center: { lat: 43.432096, lng: 13.664128 }
  }

  constructor(public router: Router, private service: ImgServiceService, private _auth: AuthenticationService) { }

  ngOnInit(): void {
    if (localStorage.getItem("token") == undefined || null) {
      this.router.navigate(['/']);
    }
  }

  exit() {
    this.router.navigate(["/upload"]);
  }

  initMarkers() {


    let value = this.service.getPosition().subscribe((report) => {
      this.initialMarkers = report;

      for (let index = 0; index < this.initialMarkers.length; index++) {
        const data = { position:{ lat: this.initialMarkers[index].latitudine, lng: this.initialMarkers[index].longitudine}};
  
        const marker = this.generateMarker(data, index);
        marker.addTo(this.map).bindPopup(`<b>${data.position.lat},  ${data.position.lng}</b>`);
        this.map.panTo(data.position);
        this.markers.push(marker);
      }

    });
  }

  generateMarker(data: any, index: number) {
    return Leaflet.marker(data.position, { draggable: data.draggable })
      .on('click', (event) => this.markerClicked(event, index))
      .on('dragend', (event) => this.markerDragEnd(event, index));
  }


  onMapReady($event: Leaflet.Map) {
    this.map = $event;
    this.initMarkers();
  }

  // Generazione del marker associato all'input dell'utente
  mapClicked($event: any) {
    const newMarker = Leaflet.marker([$event.latlng.lat, $event.latlng.lng])
      .addTo(this.map)
      .bindPopup(`<b>${$event.latlng.lat}, ${$event.latlng.lng}</b>`);
    this.markers.push(newMarker);

    const latAsString: string = `${$event.latlng.lat}`;
    const lngAsString: string = `${$event.latlng.lng}`;
    localStorage.setItem("lat", latAsString);
    localStorage.setItem("long", lngAsString);

  }

  markerClicked($event: any, index: number) {
    const latAsString: string = `${$event.latlng.lat}`;
    const lngAsString: string = `${$event.latlng.lng}`;
    localStorage.setItem("lat", latAsString);
    localStorage.setItem("long", lngAsString);
  }

  markerDragEnd($event: any, index: number) {
    console.log($event.target.getLatLng());
  }

}

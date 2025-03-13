import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ImgServiceService } from 'src/service/img.service';
import * as Leaflet from 'leaflet';

@Component({
  selector: 'app-prova',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit {

  public posts: any[] = [];
  public lista: any[] = [];
  public anno!: Number;
  public minValue!: Number;
  public maxValue!: Number;
  public test!: Number;
  public sliderValue!: Number;

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

  constructor(private service: ImgServiceService, private router: Router) { }

  // Visualizzazione delle posizioni delle foto inserite nel DB
  ngOnInit(): void {

    this.anno = Number(localStorage.getItem("anno"));
    this.service.getYear().subscribe((report) => {
      this.lista = report;
    });

    // Valore min e max dello slider in base agli anni inseriti nel DB
    this.service.getSliderValue().subscribe((report) => {
      this.minValue = report[0].min - 1;
      this.maxValue = report[0].max;
    });
  }

  // Accesso per la visualizzazione delle foto per una determinata posizione
  prova(event: any) {
    localStorage.setItem("anno", event.anno);
    window.location.reload();
  }

  // Selezione dell'anno nello slider
  onSliderChange(event: any) {
    localStorage.setItem("anno", event.target.value);
    window.location.reload();
  }

  // Generazione marker associate alle posizioni del DB
  initMarkers() {

    this.service.displayImage(this.anno).subscribe((report) => {
      this.initialMarkers = report;

      for (let index = 0; index < this.initialMarkers.length; index++) {
        var icon = Leaflet.icon({
          iconUrl: this.initialMarkers[index].thumb
      });

      const data = { position:{ lat: this.initialMarkers[index].latitudine, lng: this.initialMarkers[index].longitudine}};
      const marker = this.generateMarker(data, icon, index);
      marker.addTo(this.map);
      this.markers.push(marker);
    }

    // Visualizzazione numero foto caricate per ogni posizione nella mappa
    for (let i = this.initialMarkers.length - 1; i >= 0; i--) {
      var counter = this.initialMarkers[i].conteggio;
      const single = "foto salvata";
      const multi = "foto salvate";

      if(counter == 1){
        this.markers[i].bindTooltip(counter + " " + single).openTooltip();
      } else {
        this.markers[i].bindTooltip(counter + " " + multi).openTooltip();

      }
    }
  });
  }

  // Generazione del singolo marker
  generateMarker(data: any, icon: any, index: number) {
    return Leaflet.marker(data.position, {icon: icon})
      .on('click', (event) => this.markerClicked(event, index))
      .on('dragend', (event) => this.markerDragEnd(event, index));
  }

  onMapReady($event: Leaflet.Map) {
    this.map = $event;
    this.initMarkers();
  }

  mapClicked($event: any) {
    console.log($event.latlng.lat, $event.latlng.lng);
  }

  markerClicked($event: any, index: number) {
    const latAsString: string = `${$event.latlng.lat}`;
    const lngAsString: string = `${$event.latlng.lng}`;
    localStorage.setItem("lat", latAsString);
    localStorage.setItem("long", lngAsString);
    this.router.navigate(['/foto']);
  }

  markerDragEnd($event: any, index: number) {
    console.log($event.target.getLatLng());
  }
}


import { Component, OnInit } from '@angular/core';

// Componente backend della pagina principale
@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  constructor() { }

  // Inizializzazione di default dell'anno 
  ngOnInit(): void {
    localStorage.setItem("anno", "2002");
  }
}

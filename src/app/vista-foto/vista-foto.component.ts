import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Post } from 'src/models/post.model';
import { ImgServiceService } from 'src/service/img.service';

@Component({
  selector: 'app-vista-foto',
  templateUrl: './vista-foto.component.html',
  styleUrls: ['./vista-foto.component.css']
})
export class VistaFotoComponent implements OnInit {

  public posts: any[] = [];
  public url: any[] = []
  public anno!: Number;
  public lat!: Number;
  public long!: Number;
  public avatar!: any;

  constructor(private service: ImgServiceService, private sanitizer: DomSanitizer) { }

  // Visualizzazione delle foto associate ad un determinato anno e posizione
  ngOnInit(): void {
    this.avatar = "../../assets/avatar/stella.jpg"
    this.anno = Number(localStorage.getItem("anno"));
    this.lat = Number(localStorage.getItem("lat"));
    this.long = Number(localStorage.getItem("long"));
    let img = this.service.displayByYear(this.lat,this.long,this.anno).subscribe((report) => {
      this.posts = report;
    });
  }
}



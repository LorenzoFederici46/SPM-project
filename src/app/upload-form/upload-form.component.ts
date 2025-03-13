import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Post } from 'src/models/post.model';
import { AuthenticationService } from 'src/service/auth.service';
import { ImgServiceService } from 'src/service/img.service';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.css']
})
export class UploadFormComponent implements OnInit {

  anno!: String | null;
  id_utente!: String | null;
  lat!: String | null;
  long!: String | null;
  foto!: any;
  thumb!: any;
  descrizione!: String | null;
  post: Post = new Post();
  selectedFile!: File | undefined;
  imageData!: any;
  nome!: String | null;

  constructor(private service: ImgServiceService, private router: Router, private snackBar: MatSnackBar, private _auth: AuthenticationService) { }

  // Controllo del token di sessione
  ngOnInit(): void {
    if (localStorage.getItem("token") == undefined || null) {
      this.router.navigate(['/']);
    }
  }

  // Routing per l'inserimento della posizione nella mappa
  openDialog() {
    this.router.navigate(["/mark"]);
  }

  uploadImage(event: any) {
    this.lat = localStorage.getItem("lat");
    this.long = localStorage.getItem("long");

    // Salvataggio della foto
    this.selectedFile = event.target.files[0];

    // Lettura del contenuto per la preview della foto
    if (this.selectedFile) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        this.imageData = e.target.result;
      };

      reader.readAsDataURL(this.selectedFile);
    }
  }

  // Caricamento della foto nel DB
  upload() {

    if (this.selectedFile == undefined || null ||
      this.lat == null || this.long == null || this.nome == null ||
      this.anno == null || this.descrizione == null) {
        
      this.snackBar.open("Inserire tutti i campi", "Chiudi", {
        duration: 1000,
      });
    } else {

      this.snackBar.open("Stiamo caricando la tua foto!! 🍕", "Chiudi", {
        duration: 1000,
      });

      const formData = new FormData();
      formData.append('image', this.selectedFile);

      // Upload della foto file system
      this.service.storeImage(formData).subscribe((res) => {
        this.foto = res;
        const resize = this.foto.imageUrl;
        this.foto = resize;

        // Upload della thumbnail nel file system
        this.service.generateThumb(formData).subscribe((res) => {
          this.thumb = res;
          const thumbnail = this.thumb.imageUrl;
          this.thumb = thumbnail;

          this.post.id_utente = localStorage.getItem("idUtente");
          this.post.lat = this.lat;
          this.post.long = this.long;
          this.post.image = this.foto;
          this.post.thumb = this.thumb;
          this.post.nome = this.nome;
          this.post.descrizione = this.descrizione;
          this.post.anno = this.anno;

          // Upload del post nel DB
          this.service.uploadImage(this.post).subscribe((res) => {
            this.router.navigate(['mappa']).then(() => {
              window.location.reload();
            });
          })
        });
      });
    }
  }
}


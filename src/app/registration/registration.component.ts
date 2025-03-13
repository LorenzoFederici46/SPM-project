import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from 'src/models/user';
import { AuthenticationService } from 'src/service/auth.service';
import { UserService } from 'src/service/user.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  nome!: String;
  cognome!: String;
  email!: String;
  password!: String;
  selectedFile!: File;
  foto!: any;
  user: User = new User();

  constructor(private _utenti: UserService, private _auth: AuthenticationService, private router: Router, private snackBar: MatSnackBar) { }

  // Controllo del possesso del token di sessione
  ngOnInit(): void {
    if (localStorage.getItem("token") != undefined || null) {
      this.router.navigate(['/']);
    }
  }

   // Salvataggio della foto
  uploadAvatar(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // Registrazione dell'utente nel DB
  onRegisterSubmit() {
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.user.nome = this.nome;
    this.user.cognome = this.cognome;
    this.user.email = this.email;
    this.user.password = this.password;

    // Controllo se la mail inserita è valida
    if (this.nome == null || this.cognome == null || this.selectedFile == null ||
      this.email == null || this.password == null || !(emailRegex.test(this.email.toString()))) {
      this.snackBar.open("Credenziali inserite non valide", "Chiudi", {
        duration: 1000,
      });
    } else {
      this._utenti.checkIfAlreadyExist(this.user.email).subscribe((res) => {
        if (res.data == 0) {
          this.snackBar.open("Utente già registrato", "Chiudi", {
            duration: 2000,
          });
        } else {
          const formData = new FormData();
          formData.append('image', this.selectedFile);
          formData.append('user', this.email.toString());
          this.snackBar.open("Registrazione effettuata", "Chiudi", {
            duration: 1000,
          });
          this._utenti.storeAvatar(formData).subscribe((res) => {
            this.foto = res;
            const avatar = this.foto.imageUrl;
            this.user.avatar = avatar;
            this._utenti.register(this.user).subscribe((res) => {
              this.router.navigate(['/']).then(() => {
                window.location.reload();
              });
            });
          })
        }
      })
    }
  }
}

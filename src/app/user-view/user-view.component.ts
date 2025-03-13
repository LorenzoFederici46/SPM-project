import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImgServiceService } from 'src/service/img.service';
import { UserService } from 'src/service/user.service';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent implements OnInit {

  id_utente!: String | null;
  nome: any;
  cognome: any;
  email!: String;
  avatar: any;
  check!: Boolean;

  constructor(public router: Router, private _utenti: UserService, private service: ImgServiceService) { }
  
  ngOnInit(): void {
    if (localStorage.getItem("token") == undefined || null) {
      this.router.navigate(['/']);
    } else {
      this.id_utente = localStorage.getItem("idUtente");
      this._utenti.displayUserInfo(this.id_utente).subscribe((res) => {
        this.nome = res[0].nome;
        this.cognome = res[0].cognome;
        this.avatar = res[0].avatar;
        this.email = res[0].email;
      });
    }
  }

  onChange() {
    const user = {
      nome: this.nome,
      cognome: this.cognome,
      id: this.id_utente
    }

    this._utenti.updateUser(user).subscribe((result) => {
      if (result) {
        this.reload();
      }
    })
  }

  reload(){
    window.location.reload();
  }

  deleteUser() {
    const user = {
      id: this.id_utente,
      email: this.email
    }

    this.service.deletePhoto(this.id_utente).subscribe((res) => {
      if (res) {
        this._utenti.deleteUser(user).subscribe((res) => {
          if (res) {
            localStorage.clear();
            this.reload();
          }
        })
      }
    })
  }
}

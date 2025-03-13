import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationEnd, Router } from '@angular/router';
import { User } from 'src/models/user';
import { AuthenticationService } from 'src/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email!: String;
  password!: String;
  user: User = new User();

  constructor(private router: Router, private _auth: AuthenticationService, private snackBar: MatSnackBar) { }

  // Controllo di possesso del token di sessione
  ngOnInit(): void {
    if (localStorage.getItem("token") != undefined || null) {
      this.router.navigate(['/']);
    }

  }
  // Acquisizione dei dati e chiamata verso il backend
  confirmTheLogin() {
    this.user.email = this.email;
    this.user.password = this.password;

    if (this.email == null || this.password == null) {
      this.snackBar.open("Inserire tutti i campi", "Chiudi", {
        duration: 1000,
      });
    } else {
      this._auth.login(this.user).subscribe((res) => {
        if (res.data == 0) {
          this.snackBar.open("Credenziali inserite errate", "Chiudi", {
            duration: 1000,
          });
        } else {
          this._auth.setCurrentUser(res);
          this.reload();
        }
      });
    }
  }

  reload(){
    window.location.reload();
  }
}
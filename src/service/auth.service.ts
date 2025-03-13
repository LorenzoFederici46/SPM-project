import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from 'src/models/user';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  currentUser: User = new User();
  userToken = '';
  ruolo = '';
  id_utente = '';

  utentiUrl = 'http://localhost:3000/utenti';
  url = 'http://localhost:3000';

  constructor(private _http:HttpClient) { }

  login(data: any):Observable<any> {
    return this._http.post(this.utentiUrl + '/login', data);
  }

  setCurrentUser(user:any) {
      this.id_utente = user.data.id;
      this.currentUser.email = user.data.email;
      this.ruolo = user.data.ruolo;
      this.userToken = user.token;
      localStorage.setItem('idUtente', this.id_utente);
      localStorage.setItem('token', this.userToken);
      localStorage.setItem('ruolo', this.ruolo);
      window.location.reload();
    }
  
    getToken(): String | null {
      return localStorage.getItem('token');
    }
  
    getUserID(): String | null {
      return localStorage.getItem('id');
    }
  
    isAuthenticated(): boolean {   
      if(this.getToken() == undefined || null) {
        return false;
      }
      return true;
    }

    verifyToken(data: any):Observable<any> {
      return this._http.get(this.utentiUrl + '/verifica', data);
    }
  } 

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  utentiUrl = 'http://localhost:3000/utenti';
  url = 'http://localhost:3000';

  constructor(private _http:HttpClient) { }

  register(data:any):Observable<any>{
    return this._http.post(this.utentiUrl + '/register', data);
  }

  checkIfAlreadyExist(data:any):Observable<any>{
    return this._http.get(this.utentiUrl + '/check/' + data);
  }

  storeAvatar(data:any){
    return this._http.post(this.url + '/avatar', data);
  }

  displayUserInfo(data:any):Observable<any>{
    return this._http.get(this.utentiUrl + '/info/' + data);
  }

  updateUser(data:any):Observable<any>{
    return this._http.put(this.utentiUrl + '/update', data);
  }

  deleteUser(data:any) {
    return this._http.post(this.utentiUrl + '/delete', data);
  }
}

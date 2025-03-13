import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImgServiceService {

  utentiUrl = 'http://localhost:3000/utenti';
  url = 'http://localhost:3000';

  constructor(private http:HttpClient) { }

  uploadImage(data:any): Observable<any>{
    return this.http.post(this.url + '/upload', data);
  }

  displayImage(anno: Number): Observable<any>{
    return this.http.get(this.url + '/img/' + anno);
  }

  displayByYear(lat: Number, long: Number, anno: Number): Observable<any>{
    return this.http.get(this.url + '/img/' + lat + '/' + long + '/' + anno);
  }

  storeImage(data:any){
    return this.http.post(this.url + '/test', data);
  }

  generateThumb(data:any){
    return this.http.post(this.url + '/thumb', data);
  }

  getYear(): Observable<any>{
    return this.http.get(this.url + '/year');
  }

  getSliderValue(): Observable<any>{
    return this.http.get(this.url + '/slider');
  }

  getPosition(): Observable<any>{
    return this.http.get(this.url + '/img');
  }

  deletePhoto(data:any): Observable<any>{
    return this.http.get(this.url + '/foto/' + data);
  }
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MapViewComponent } from './map-view/map-view.component';
import { MainPageComponent } from './main-page/main-page.component';
import { LoginComponent } from './login/login.component';
import { UploadFormComponent } from './upload-form/upload-form.component';
import { VistaFotoComponent } from './vista-foto/vista-foto.component';
import { MarkerComponent } from './marker/marker.component';
import { RegistrationComponent } from './registration/registration.component';
import { UserViewComponent } from './user-view/user-view.component';

const routes: Routes = [
  {
    path: '', component: MainPageComponent  
  },
  {
    path: 'login', component: LoginComponent       
  },
  {
    path: 'register', component: RegistrationComponent   
  },
  {
    path: 'upload', component: UploadFormComponent
  },
  {
    path: 'foto', component: VistaFotoComponent 
  },
  {
    path: 'mappa', component: MapViewComponent  
  },
  {
    path: 'mark', component: MarkerComponent  
  },
  {
    path: 'profile', component: UserViewComponent  
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

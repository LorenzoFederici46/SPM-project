import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Porto Recanati Portal';
  checkLogin!: Boolean;
  checkLogout!: Boolean;
  checkRegister!: Boolean;
  checkUpload!: Boolean;
  isAuthenticated!: Boolean;

  constructor(private route: Router, private breakpointObserver: BreakpointObserver, private _auth: AuthenticationService) { }

  ngOnInit(): void {
    if (localStorage.getItem("token") != undefined || null) {
      this.isAuthenticated = true;
    } else {
      this.isAuthenticated = false;
    }
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );


  // Routing della navbar verso i vari componenti
  openLoginForm() {
    this.route.navigate(['/login']);
  }

  openRegisterForm() {
    this.route.navigate(['/register']);
  }

  backHome() {
    this.route.navigate(['/']);
  }

  openMap() {
    this.route.navigate(['/mappa']);
  }

  openUploadForm() {
    this.route.navigate(['/upload']).then(() => {
      this.reloadPage();
    });
  }

  viewUserProfile(){
    this.route.navigate(['/profile']).then(() => {
      this.reloadPage();
    });
  }

  logOut() {
    localStorage.clear();
    this.route.navigate(['/']).then(() => {
     this.reloadPage();
    });
  }

  reloadPage() {
    window.location.reload();
  }

}

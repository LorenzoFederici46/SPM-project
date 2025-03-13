import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from 'src/service/auth.service';
import { of } from 'rxjs';
import { User } from 'src/models/user';

describe('LoginComponent', () => {

  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  let authService: AuthenticationService;
  let snackBar: MatSnackBar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: AuthenticationService, useValue: { login: jasmine.createSpy('login').and.returnValue(of({ data: 1 })), setCurrentUser: jasmine.createSpy('setCurrentUser') } },
        { provide: MatSnackBar, useValue: { open: jasmine.createSpy('open') } }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthenticationService);
    snackBar = TestBed.inject(MatSnackBar);
    fixture.detectChanges();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to home if token is not valid in local storage on ngOnInit', () => {
    spyOn(localStorage, 'getItem').and.returnValue('dummyToken');
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should show snackbar if email or password is null on confirmTheLogin', () => {
    component.confirmTheLogin();
    expect(snackBar.open).toHaveBeenCalledWith("Inserire tutti i campi", "Chiudi", { duration: 1000 });
  });

  it('should call login service and navigate to home if login successful on confirmTheLogin', () => {
    component.email = 'test@example.com';
    component.password = 'password';
    const reloadSpy = spyOn(component, 'reload');

    component.confirmTheLogin();
    expect(authService.login).toHaveBeenCalledWith(jasmine.objectContaining({ email: 'test@example.com', password: 'password' }));
    expect(authService.setCurrentUser).toHaveBeenCalled();
    expect(reloadSpy).toHaveBeenCalled();
  });

});

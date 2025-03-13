import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrationComponent } from './registration.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from 'src/service/auth.service';
import { UserService } from 'src/service/user.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    const userService = jasmine.createSpyObj('UserService', ['checkIfAlreadyExist', 'storeAvatar', 'register']);
    const authService = jasmine.createSpyObj('AuthenticationService', ['']);
    const snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [ 
        FormsModule,
        HttpClientModule,
        RouterTestingModule
      ],
      declarations: [ RegistrationComponent ],
      providers: [
        { provide: UserService, useValue: userService },
        { provide: AuthenticationService, useValue: authService },
        { provide: MatSnackBar, useValue: snackBar }
      ]
    })
    .compileComponents();

    
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    authServiceSpy = TestBed.inject(AuthenticationService) as jasmine.SpyObj<AuthenticationService>;
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should upload avatar', () => {
    const file = new File([""], "filename.txt");
    const event = { target: { files: [file] } };
    component.uploadAvatar(event);
    expect(component.selectedFile).toEqual(file);
  });

  it('should handle invalid credentials', () => {
    const invalidUser = {
      nome: null,
      cognome: null,
      email: null,
      password: null,
      avatar: null
    };

    component.onRegisterSubmit();

    expect(snackBarSpy.open).toHaveBeenCalledWith('Credenziali inserite non valide', 'Chiudi', { duration: 1000 });
    expect(userServiceSpy.checkIfAlreadyExist).not.toHaveBeenCalled();
  });

  it('should handle already registered user', () => {
    userServiceSpy.checkIfAlreadyExist.and.returnValue(of({ data: 0 }));

    component.nome = 'John';
    component.cognome = 'Doe';
    component.email = 'john@example.com';
    component.password = 'password';
    component.selectedFile = new File([""], "filename.txt");

    component.onRegisterSubmit();

    expect(snackBarSpy.open).toHaveBeenCalledWith('Utente già registrato', 'Chiudi', { duration: 2000 });
    expect(userServiceSpy.storeAvatar).not.toHaveBeenCalled();
    expect(userServiceSpy.register).not.toHaveBeenCalled();
  });
});

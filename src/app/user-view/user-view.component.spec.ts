import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserViewComponent } from './user-view.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { UserService } from 'src/service/user.service';
import { ImgServiceService } from 'src/service/img.service';
import { of } from 'rxjs';

describe('UserViewComponent', () => {
  let component: UserViewComponent;
  let fixture: ComponentFixture<UserViewComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let imgService: jasmine.SpyObj<ImgServiceService>;
  let router: Router;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['displayUserInfo', 'updateUser', 'deleteUser']);
    const imgServiceSpy = jasmine.createSpyObj('ImgServiceService', ['deletePhoto']);

    await TestBed.configureTestingModule({
      declarations: [ UserViewComponent ],
      imports: [ RouterTestingModule ],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: ImgServiceService, useValue: imgServiceSpy }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserViewComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    imgService = TestBed.inject(ImgServiceService) as jasmine.SpyObj<ImgServiceService>;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
  it('should navigate to home if token is not valid in local storage on ngOnInit', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    const routerSpy = spyOn(router, 'navigate');
    component.ngOnInit();
    expect(routerSpy).toHaveBeenCalledWith(['/']);
  });

  it('should fetch user info on ngOnInit and set the component properties accordingly', () => {
    const userInfo = {
      id_utente: 'test_id',
      nome: 'Test',
      cognome: 'User',
      email: 'test@example.com',
      avatar: 'avatar_url'
    };

    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'token') return 'dummyToken';
      if (key === 'idUtente') return userInfo.id_utente;
      return null; 
    });

    userService.displayUserInfo.and.returnValue(of([userInfo]));
    component.ngOnInit();

    expect(userService.displayUserInfo).toHaveBeenCalledWith(userInfo.id_utente);
    expect(component.nome).toEqual(userInfo.nome);
    expect(component.cognome).toEqual(userInfo.cognome);
    expect(component.email).toEqual(userInfo.email);
    expect(component.avatar).toEqual(userInfo.avatar);
  });

  it('should update user info and reload the page on onChange', () => {
    const user = { nome: 'New Name', cognome: 'New Surname', id: 'test_id' };
    component.nome = user.nome;
    component.cognome = user.cognome;
    component.id_utente = user.id;
    const reloadSpy = spyOn(component, 'reload');

    userService.updateUser.and.returnValue(of(true));
    
    component.onChange();

    expect(userService.updateUser).toHaveBeenCalledWith(user);
    expect(reloadSpy).toHaveBeenCalled();
  });

  it('should delete user, clear local storage, navigate to home, and reload page on deleteUser', () => {
    const user = { id: 'test_id', email: 'test@example.com' }; 
    const clearSpy = spyOn(localStorage, 'clear');
    const reloadSpy = spyOn(component, 'reload');
  
    imgService.deletePhoto.and.returnValue(of(true));
    userService.deleteUser.and.returnValue(of(true));
   
    component.id_utente = user.id;
    component.email = user.email;

    component.deleteUser();

    expect(imgService.deletePhoto).toHaveBeenCalledWith(user.id);
    expect(userService.deleteUser).toHaveBeenCalledWith(user);
    expect(clearSpy).toHaveBeenCalled();
    expect(reloadSpy).toHaveBeenCalled();
  });
});

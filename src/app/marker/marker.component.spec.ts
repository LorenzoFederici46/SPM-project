import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MarkerComponent } from './marker.component';
import { AuthenticationService } from 'src/service/auth.service';
import { ImgServiceService } from 'src/service/img.service';
import { RouterTestingModule } from '@angular/router/testing';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as L from 'leaflet';

describe('MarkerComponent', () => {
  let component: MarkerComponent;
  let fixture: ComponentFixture<MarkerComponent>;
  let imgServiceSpy: jasmine.SpyObj<ImgServiceService>;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;

  beforeEach(async () => {
    imgServiceSpy = jasmine.createSpyObj('ImgServiceService', ['getPosition']);
    authServiceSpy = jasmine.createSpyObj('AuthenticationService', ['isLoggedIn']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, LeafletModule],
      declarations: [ MarkerComponent ],
      providers: [
        { provide: ImgServiceService, useValue: imgServiceSpy },
        { provide: AuthenticationService, useValue: authServiceSpy }
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set lat and long in local storage on marker click', () => {
    const latlng = { lat: 43.432096, lng: 13.664128 };

    component.markerClicked({ latlng }, 0);

    expect(localStorage.getItem('lat')).toBe(`${latlng.lat}`);
    expect(localStorage.getItem('long')).toBe(`${latlng.lng}`);
  });

});

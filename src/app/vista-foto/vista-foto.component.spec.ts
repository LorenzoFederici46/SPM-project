import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaFotoComponent } from './vista-foto.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('VistaFotoComponent', () => {
  let component: VistaFotoComponent;
  let fixture: ComponentFixture<VistaFotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistaFotoComponent ],
      imports: [HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VistaFotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

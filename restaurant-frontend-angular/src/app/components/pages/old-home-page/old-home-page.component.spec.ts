import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OldHomePageComponent } from './old-home-page.component';


describe('HomeComponent', () => {
  let component: OldHomePageComponent;
  let fixture: ComponentFixture<OldHomePageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OldHomePageComponent]
    });
    fixture = TestBed.createComponent(OldHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

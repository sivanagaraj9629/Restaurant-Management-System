import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BillsPageComponent } from './bills-page.component';


describe('BillPageComponent', () => {
  let component: BillsPageComponent;
  let fixture: ComponentFixture<BillsPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BillsPageComponent]
    });
    fixture = TestBed.createComponent(BillsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

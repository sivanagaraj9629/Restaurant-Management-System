import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardPageUserComponent } from './dashboard-page-user.component';

describe('UserDashboardComponent', () => {
  let component: DashboardPageUserComponent;
  let fixture: ComponentFixture<DashboardPageUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardPageUserComponent]
    });
    fixture = TestBed.createComponent(DashboardPageUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardPageAdminComponent } from './dashboard-page-admin.component';

describe('DashboardPageComponent', () => {
  let component: DashboardPageAdminComponent;
  let fixture: ComponentFixture<DashboardPageAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardPageAdminComponent]
    });
    fixture = TestBed.createComponent(DashboardPageAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

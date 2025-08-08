import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoriesPageComponent } from './categories-page.component';



describe('CategoryPageComponent', () => {
  let component: CategoriesPageComponent;
  let fixture: ComponentFixture<CategoriesPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoriesPageComponent]
    });
    fixture = TestBed.createComponent(CategoriesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

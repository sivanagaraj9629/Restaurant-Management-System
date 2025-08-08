import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemsPageComponent } from './items-page.component';



describe('ItemPageComponent', () => {
  let component: ItemsPageComponent;
  let fixture: ComponentFixture<ItemsPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemsPageComponent]
    });
    fixture = TestBed.createComponent(ItemsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

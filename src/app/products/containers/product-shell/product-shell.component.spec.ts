import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductShellComponent } from './product-shell.component';

describe('ProductShellComponent', () => {
  let component: ProductShellComponent;
  let fixture: ComponentFixture<ProductShellComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProductShellComponent]
    });
    fixture = TestBed.createComponent(ProductShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

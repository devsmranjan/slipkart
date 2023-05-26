import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastShellComponent } from './toast-shell.component';

describe('ToastShellComponent', () => {
  let component: ToastShellComponent;
  let fixture: ComponentFixture<ToastShellComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ToastShellComponent]
    });
    fixture = TestBed.createComponent(ToastShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

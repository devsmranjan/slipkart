import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, delay, map } from 'rxjs';
import { ToastInterface } from '../models/toast.model';

interface ToastState {
  toast: ToastInterface | null;
}

const initialState: ToastState = {
  toast: null,
};

@Injectable()
export class ToastStore extends ComponentStore<ToastState> {
  constructor() {
    super(initialState);
  }

  readonly #toast$ = this.select((state) => state.toast);

  readonly vm$ = this.select(this.#toast$, (toast) => ({
    toast,
  }));

  readonly #setToast = this.updater((state, toast: ToastInterface) => {
    return {
      ...state,
      toast,
    };
  });

  readonly hideToast = this.updater((state) => {
    return {
      ...state,
      toast: null,
    };
  });

  readonly #hideToastWithDelay = this.effect((trigger$) =>
    trigger$.pipe(
      delay(3000),
      map(() => this.hideToast())
    )
  );

  readonly #showAndHideToast = this.effect(
    (toast$: Observable<ToastInterface>) =>
      toast$.pipe(
        map((toast) => {
          this.#setToast(toast);
          this.#hideToastWithDelay();
        })
      )
  );

  showToast(toast: ToastInterface) {
    if (toast.autoHide) {
      this.#showAndHideToast(toast);
    } else {
      this.#setToast(toast);
    }
  }
}

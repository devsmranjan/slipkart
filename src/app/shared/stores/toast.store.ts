import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, delay, map } from 'rxjs';

import { ToastInterface } from '../models';

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

  /* -------------------------------------------------------------------------- */
  /*                                  Selectors                                 */
  /* -------------------------------------------------------------------------- */

  readonly #toast$ = this.select((state) => state.toast);

  readonly vm$ = this.select(this.#toast$, (toast) => ({
    toast,
  }));

  /* -------------------------------------------------------------------------- */
  /*                                  Updaters                                  */
  /* -------------------------------------------------------------------------- */

  readonly #setToast = this.updater((state, toast: ToastInterface | null) => {
    return {
      ...state,
      toast,
    };
  });

  /* -------------------------------------------------------------------------- */
  /*                                   Effects                                  */
  /* -------------------------------------------------------------------------- */

  readonly #hideToastWithDelay = this.effect((trigger$) =>
    trigger$.pipe(
      delay(3000),
      map(() => this.#setToast(null))
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

  /* -------------------------------------------------------------------------- */
  /*                                   Methods                                  */
  /* -------------------------------------------------------------------------- */

  showToast(toast: ToastInterface) {
    if (toast.autoHide) {
      this.#showAndHideToast(toast);
      return;
    }

    this.#setToast(toast);
  }

  hideToast() {
    this.#setToast(null);
  }
}

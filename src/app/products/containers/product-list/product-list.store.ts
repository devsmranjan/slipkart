import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, switchMap, tap } from 'rxjs';
import { ToastStore } from '../../../shared/store/toast.store';
import { ProductInterface } from '../../models';
import { ProductService } from '../../product.service';

interface ProductListState {
  products: ProductInterface[] | null;
  loading: boolean;
  error: string | null;
}

export const initialProductListState: ProductListState = {
  products: null,
  loading: false,
  error: null,
};

export class ProductListStore extends ComponentStore<ProductListState> {
  // injects
  #productService = inject(ProductService);
  #toastStore = inject(ToastStore);

  constructor() {
    super(initialProductListState);
  }

  // selectors
  readonly #products$ = this.select((state) => state.products);
  readonly #loading$ = this.select((state) => state.loading);
  readonly #error$ = this.select((state) => state.error);

  // view models
  readonly vm$ = this.select(
    this.#products$,
    this.#loading$,
    this.#error$,
    (products, loading, error) => ({
      products,
      loading,
      error,
    })
  );

  // updaters
  readonly #setProducts = this.updater(
    (state: ProductListState, products: ProductInterface[] | null) => ({
      ...state,
      products,
    })
  );

  readonly #setLoading = this.updater(
    (state: ProductListState, loading: boolean) => ({
      ...state,
      loading,
    })
  );

  readonly #setError = this.updater(
    (state: ProductListState, error: string | null) => ({
      ...state,
      error,
    })
  );

  // effects
  readonly loadProducts = this.effect(
    (params$: Observable<{ skip: number; limit: number }>) =>
      params$.pipe(
        tap(() => {
          this.#setLoading(true);
        }),
        switchMap(({ limit, skip }) =>
          this.#productService.getProducts(limit, skip).pipe(
            tapResponse(
              (response) => {
                this.#setProducts(response.products);
                this.#setError(null);
              },
              (error: HttpErrorResponse) => {
                this.#setError(error.error?.message ?? error.message);
              },
              () => {
                this.#setLoading(false);
                this.#toastStore.hideToast();
              }
            )
          )
        )
      )
  );
}

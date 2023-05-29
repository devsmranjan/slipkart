import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, switchMap, tap } from 'rxjs';
import { ProductInterface } from '../../models';
import { ProductService } from '../../product.service';

interface ProductDetailsState {
  product: ProductInterface | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductDetailsState = {
  product: null,
  loading: false,
  error: null,
};

export class ProductDetailsStore extends ComponentStore<ProductDetailsState> {
  constructor() {
    super(initialState);
  }

  // inject
  readonly #productService = inject(ProductService);

  readonly #product$ = this.select((state) => state.product);
  readonly #loading$ = this.select((state) => state.loading);
  readonly #error$ = this.select((state) => state.error);

  readonly vm$ = this.select(
    this.#product$,
    this.#loading$,
    this.#error$,
    (product, loading, error) => ({
      product,
      loading,
      error,
    })
  );

  readonly setProduct = this.updater(
    (state: ProductDetailsState, product: ProductInterface | null) => ({
      ...state,
      product,
    })
  );

  readonly setLoading = this.updater(
    (state: ProductDetailsState, loading: boolean) => ({
      ...state,
      loading,
    })
  );

  readonly setError = this.updater(
    (state: ProductDetailsState, error: string | null) => ({
      ...state,
      error,
    })
  );

  readonly loadProduct = this.effect((id$: Observable<number | string>) => {
    return id$.pipe(
      tap(() => {
        this.setLoading(true);
      }),
      switchMap((id) =>
        this.#productService.getProduct(id).pipe(
          tapResponse(
            (product) => {
              this.setProduct(product);
              this.setError(null);
            },
            (error: HttpErrorResponse) => {
              this.setError(error.error?.message ?? error.message);
            },
            () => {
              this.setLoading(false);
            }
          )
        )
      )
    );
  });
}

import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { v4 as uuid4 } from 'uuid';

import { ProductInterface } from '../../products/models';
import { CartInterface } from '../models/cart.model';

interface CartState {
  cart: CartInterface[];
}

const initialState: CartState = {
  cart: [],
};

@Injectable()
export class CartStore extends ComponentStore<CartState> {
  constructor() {
    super(initialState);
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Selectors                                 */
  /* -------------------------------------------------------------------------- */

  readonly #cart$ = this.select((state) => state.cart);
  readonly #cartCount$ = this.select(this.#cart$, (cart) =>
    cart.reduce((acc, item) => acc + item.quantity, 0)
  );
  readonly #hasProduct$ = this.select(
    this.#cart$,
    (cart) => (product: ProductInterface) =>
      cart.some((item) => item.product.id === product.id)
  );
  readonly #cartValue$ = this.select(this.#cart$, (cart) =>
    cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  );

  readonly vm$ = this.select(
    this.#cart$,
    this.#cartCount$,
    this.#hasProduct$,
    this.#cartValue$,
    (cart, cartCount, hasProduct, cartValue) => ({
      cart,
      cartCount,
      hasProduct,
      cartValue,
    })
  );

  /* -------------------------------------------------------------------------- */
  /*                                  Updaters                                  */
  /* -------------------------------------------------------------------------- */

  readonly addProduct = this.updater(
    (state: CartState, product: ProductInterface) => {
      return {
        ...state,
        cart: [...state.cart, { id: uuid4(), product, quantity: 1 }],
      };
    }
  );

  readonly removeProduct = this.updater(
    (state: CartState, productId: number | string) => {
      return {
        ...state,
        cart: state.cart.filter((item) => item.product.id !== productId),
      };
    }
  );

  readonly updateProductQuantity = this.updater(
    (state: CartState, payload: { id: number | string; quantity: number }) => {
      if (payload.quantity < 1) {
        return {
          ...state,
          cart: state.cart.filter((item) => item.id !== payload.id),
        };
      }

      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === payload.id
            ? { ...item, quantity: payload.quantity }
            : item
        ),
      };
    }
  );
}

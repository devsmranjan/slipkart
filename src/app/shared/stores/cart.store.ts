import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { v4 as uuid4 } from 'uuid';

import { ProductInterface } from '../../features/product/models';
import { CartInterface } from '../models';

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

  increaseProductQuantity = this.updater(
    (state: CartState, cartItem: CartInterface) => {
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === cartItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
    }
  );

  decreaseProductQuantity = this.updater(
    (state: CartState, cartItem: CartInterface) => {
      if (!cartItem) {
        return state;
      }

      if (cartItem.quantity < 2) {
        return {
          ...state,
          cart: state.cart.filter((item) => item.id !== cartItem.id),
        };
      }

      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === cartItem.id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        ),
      };
    }
  );
}

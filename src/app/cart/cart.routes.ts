import { Route } from '@angular/router';

export const CART_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./containers/cart-shell/cart-shell.component').then(
        (c) => c.CartShellComponent
      ),
  },
];

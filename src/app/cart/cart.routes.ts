import { Route } from '@angular/router';

export const CART_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./cart.component').then((c) => c.CartComponent),
  },
];

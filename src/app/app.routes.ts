import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./products/product.routes').then((r) => r.PRODUCT_ROUTES),
  },
  {
    path: 'cart',
    loadChildren: () => import('./cart/cart.routes').then((r) => r.CART_ROUTES),
  },
];

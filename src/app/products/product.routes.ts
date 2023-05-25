import { Route } from '@angular/router';
import { ProductShellComponent } from './containers/product-shell/product-shell.component';

export const PRODUCT_ROUTES: Route[] = [
  {
    path: '',
    component: ProductShellComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./containers/product-list/product-list.component').then(
            (c) => c.ProductListComponent
          ),
        outlet: 'products',
      },
    ],
  },
];

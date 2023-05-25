import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ProductInterface } from '../../models';
import { ProductService } from '../../product.service';
import { ProductListStore } from './product-list.store';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, HttpClientModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  providers: [ProductListStore, ProductService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent implements OnInit {
  // injects
  #productListStore = inject(ProductListStore);

  // view models
  readonly vm$ = this.#productListStore.vm$;

  ngOnInit(): void {
    this.#productListStore.loadProducts({ limit: 10, skip: 0 });
  }

  trackById(index: number, product: ProductInterface) {
    return product.id;
  }
}

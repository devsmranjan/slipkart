import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ProductInterface, ProductResponseInterface } from './models';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // injects
  #http = inject(HttpClient);

  // constants
  #SERVER_URL: string = 'https://dummyjson.com';

  getProducts(limit: number, skip: number) {
    return this.#http.get<ProductResponseInterface>(
      `${this.#SERVER_URL}/products?limit=${limit}&skip=${skip}`
    );
  }

  getProduct(id: number | string) {
    return this.#http.get<ProductInterface>(
      `${this.#SERVER_URL}/products/${id}`
    );
  }
}

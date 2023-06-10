import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { ProductInterface, ProductResponseInterface } from './models';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  /* -------------------------------------------------------------------------- */
  /*                                   Injects                                  */
  /* -------------------------------------------------------------------------- */

  #http = inject(HttpClient);

  /* -------------------------------------------------------------------------- */
  /*                                  Properties                                */
  /* -------------------------------------------------------------------------- */

  #SERVER_URL: string = 'https://dummyjson.com';

  /* -------------------------------------------------------------------------- */
  /*                                 Methods                                    */
  /* -------------------------------------------------------------------------- */

  getProducts(limit: number, page: number, query: string | null) {
    let URL = `${this.#SERVER_URL}/products`;

    const params = new URLSearchParams({
      limit: limit.toString(),
      skip: (page * limit).toString(),
    });

    if (query) {
      URL = `${URL}/search`;
      params.append('q', query);
    }

    return this.#http.get<ProductResponseInterface>(
      `${URL}?${params.toString()}`
    );
  }

  getProduct(id: number | string) {
    return this.#http.get<ProductInterface>(
      `${this.#SERVER_URL}/products/${id}`
    );
  }
}

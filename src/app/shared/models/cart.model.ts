import { ProductInterface } from '../../products/models';

export interface CartInterface {
  id: number | string;
  product: ProductInterface;
  quantity: number;
}

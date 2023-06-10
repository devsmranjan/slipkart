import { ProductInterface } from '../../product/models';

export interface CartInterface {
  id: number | string;
  product: ProductInterface;
  quantity: number;
}

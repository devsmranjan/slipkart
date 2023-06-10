import { ProductInterface } from '../../features/product/models';

export interface CartInterface {
  id: number | string;
  product: ProductInterface;
  quantity: number;
}

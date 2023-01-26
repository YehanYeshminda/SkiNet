import { v4 as uuid } from 'uuid';

export interface IBasketItem {
  id: number;
  productName: string;
  price: number;
  qty: number;
  pictureUrl: string;
  brand: string;
  type: string;
}

export interface IBasket {
  id: string;
  items: IBasketItem[];
}

export class Basket implements IBasket {
    id = uuid(); // this is in order to create a unique id for each basket
    items: IBasketItem[];
}

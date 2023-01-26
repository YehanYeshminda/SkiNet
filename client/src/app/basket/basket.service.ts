import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Basket, IBasket, IBasketItem } from '../shared/models/basket';
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  baseUrl = environment.apiUrl;
  private basketSource = new BehaviorSubject<IBasket>(null); // BehaviorSubject is a type of observable
  basket$ = this.basketSource.asObservable(); // used in order to access the observable from the template as a public

  constructor(private http: HttpClient) {}

  // this method is used in order to get the basket from the API
  getBasket(id: string) {
    return this.http.get(this.baseUrl + 'basket?id=' + id).pipe( // this is in order to subscribe to the observable
      map((basket: IBasket) => {
        this.basketSource.next(basket); // this is in order to update the basketSource with the basket that we get from the API
      })
    );
  }

  // this method is used in order to set the basket in the API
  setBasket(basket: IBasket) {
    return this.http.post(this.baseUrl + 'basket', basket).subscribe({ // this is in order to subscribe to the observable
      next: (response: IBasket) => {
        this.basketSource.next(response); // this is in order to update the basketSource with the basket that we get from the API
        console.log(response);
      },
      error: (error) => {
        console.log(error); // this is in order to log the error in the console
      }
    });
  }

  // this method is used in order to get the current basket value
  getCurrentBasketValue() { // this is in order to get the current value of the basket in a easy way
    return this.basketSource.value;
  }

  // this method is used in order to add an item to the basket
  addItemToBasket(item: IProduct, quantity = 1) {
    const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(
      item,
      quantity
    );
    const basket = this.getCurrentBasketValue() ?? this.createBasket(); // this is in order to get the current basket value or create a new basket if it doesn't exist
    basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity); // this is in order to add or update the item in the basket
    this.setBasket(basket); // this is in order to set the basket in the API
  }

  // this method is used in order to increment the quantity of an item in the basket
  addOrUpdateItem(items: IBasketItem[], itemToAdd: IBasketItem, quantity: number): IBasketItem[] {
    console.log(items);
    const index = items.findIndex((i) => i.id === itemToAdd.id); // this is in order to find the index of the item in the basket
    if (index === -1) { // this is in order to check if the item doesn't exist in the basket
      itemToAdd.qty = quantity; // this is in order to set the quantity of the item
      items.push(itemToAdd); // this is in order to push the item to the basket
    } else {
      items[index].qty += quantity; // this is in order to increment the quantity of the item
    }
    return items; // this is in order to return the basket
  }

  // this method is used in order to create a new basket
  createBasket(): IBasket {
    const basket = new Basket(); // this is in order to create a new basket
    localStorage.setItem('basket_id', basket.id); // this is in order to set the basket id in the local storage in order to persist
    return basket;
  }

  // this is in order to map the product item to the basket item
  private mapProductItemToBasketItem(item: IProduct, quantity: number): IBasketItem {
    return { // this is in order to return the basket item and to map the product item to the basket item
      id: item.id,
      productName: item.name,
      price: item.price,
      qty: quantity,
      pictureUrl: item.pictureUrl,
      brand: item.productBrand,
      type: item.productType,
    };
  }
}

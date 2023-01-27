import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  Basket,
  IBasket,
  IBasketItem,
  IBasketTotals,
} from '../shared/models/basket';
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  baseUrl = environment.apiUrl;
  private basketSource = new BehaviorSubject<IBasket>(null); // BehaviorSubject is a type of observable
  private basketTotalSource = new BehaviorSubject<IBasketTotals>(null); // BehaviorSubject is a type of observable
  basket$ = this.basketSource.asObservable(); // used in order to access the observable from the template as a public
  basketTotal$ = this.basketTotalSource.asObservable(); // used in order to access the observable from the template as a public

  constructor(private http: HttpClient) {}

  // this method is used in order to get the basket from the API
  getBasket(id: string) {
    return this.http.get(this.baseUrl + 'basket?id=' + id).pipe(
      // this is in order to subscribe to the observable
      map((basket: IBasket) => {
        this.basketSource.next(basket); // this is in order to update the basketSource with the basket that we get from the API
        this.calculateTotals(); // this is in order to calculate the totals since we have already gotten the basket at this point
      })
    );
  }

  // this method is used in order to set the basket in the API
  setBasket(basket: IBasket) {
    return this.http.post(this.baseUrl + 'basket', basket).subscribe({
      // this is in order to subscribe to the observable
      next: (response: IBasket) => {
        this.basketSource.next(response); // this is in order to update the basketSource with the basket that we get from the API
        this.calculateTotals(); // this is in order to calculate the totals since we have already gotten the basket at this point
      },
      error: (error) => {
        console.log(error); // this is in order to log the error in the console
      },
    });
  }

  // this method is used in order to get the current basket value
  getCurrentBasketValue() {
    // this is in order to get the current value of the basket in an easy way
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
  addOrUpdateItem(
    items: IBasketItem[],
    itemToAdd: IBasketItem,
    quantity: number
  ): IBasketItem[] {
    console.log(items);
    const index = items.findIndex((i) => i.id === itemToAdd.id); // this is in order to find the index of the item in the basket
    if (index === -1) {
      // this is in order to check if the item doesn't exist in the basket
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

  incrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue(); // this is in order to get the current basket value
    const foundItemIndex = basket.items.findIndex((x) => x.id === item.id); // this is in order to find the index of the item in the basket
    basket.items[foundItemIndex].qty++; // this is in order to increment the quantity of the item
    this.setBasket(basket); // this is in order to set the basket in the API
  }

  decrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue(); // this is in order to get the current basket value
    const foundItemIndex = basket.items.findIndex((x) => x.id === item.id); // this is in order to find the index of the item in the basket
    if (basket.items[foundItemIndex].qty > 1) {
      // this is in order to check if the quantity of the item is greater than 1
      basket.items[foundItemIndex].qty--; // this is in order to decrement the quantity of the item
      this.setBasket(basket); // this is in order to set the basket in the API
    } else {
      this.removeItemFromBasket(item); // this is in order to remove the item from the basket
    }
  }

  removeItemFromBasket(item: IBasketItem) {
    const basket = this.getCurrentBasketValue(); // this is in order to get the current basket value
    if (basket.items.some((x) => x.id === item.id)) {
      // this is in order to check if the item exists in the basket
      basket.items = basket.items.filter((i) => i.id !== item.id); // this is in order to filter the basket items and remove the item from the basket
      if (basket.items.length > 0) {
        // this is in order to check if the basket has items
        this.setBasket(basket); // this is in order to set the basket in the API
      } else {
        this.deleteBasket(basket); // this is in order to delete the basket
      }
    }
  }

  deleteBasket(basket: IBasket) {
    this.http.delete(this.baseUrl + 'basket?id=' + basket.id).subscribe({
      // this is in order to delete the basket in the API
      next: () => {
        this.basketSource.next(null); // this is in order to set the basketSource to null
        localStorage.removeItem('basket_id'); // this is in order to remove the basket id from the local storage
      },
      error: (error) => {
        console.log(error); // this is in order to log the error in the console
      },
    });
  }

  // this is in order to map the product item to the basket item
  private mapProductItemToBasketItem(
    item: IProduct,
    quantity: number
  ): IBasketItem {
    return {
      // this is in order to return the basket item and to map the product item to the basket item
      id: item.id,
      productName: item.name,
      price: item.price,
      qty: quantity,
      pictureUrl: item.pictureUrl,
      brand: item.productBrand,
      type: item.productType,
    };
  }

  private calculateTotals() {
    const basket = this.getCurrentBasketValue(); // this is in order to get the current basket value
    const shipping = 0; // this is in order to set the shipping
    const subtotal = basket.items.reduce((a, b) => b.price * b.qty + a, 0); // this is in order to calculate the subtotal of all the basket items
    const total = subtotal + shipping; // this is in order to calculate the total of the basket
    this.basketTotalSource.next({ shipping, total, subtotal }); // this is in order to update the basketTotalSource with the new values
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IBasket } from '../shared/models/basket';

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
      },
      error: (error) => {
        console.log(error); // this is in order to log the error in the console
      }
    });
  }

  getCurrentBasketValue() { // this is in order to get the current value of the basket in a easy way
    return this.basketSource.value;
  }
}

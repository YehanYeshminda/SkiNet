import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, map } from 'rxjs';
import { IBrand } from '../shared/models/brand';
import { IPagination } from '../shared/models/pagination';
import { IProductType } from '../shared/models/productType';
import { ShopParams } from '../shared/models/shopParams';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl: string = "https://localhost:5001/api/";


  constructor(private http: HttpClient) { }

  getProducts (shopParams: ShopParams) {
    let parameters = new HttpParams();

    if (shopParams.brandId) {
      parameters = parameters.append('brandId', shopParams.brandId.toString());
    }

    if (shopParams.typeId) {
      parameters = parameters.append("typeId", shopParams.typeId.toString());
    }

    if (shopParams.sort) {
      parameters = parameters.append("sort", shopParams.sort)
    }

    // getting the body from the observable and then projecting into the pagination class
    return this.http.get<IPagination>(this.baseUrl + "products", { observe: 'response', params: parameters})
      .pipe(
        // delay(1000),
        map(res => {
          return res.body
        })
      )
  }

  getBrands () {
    return this.http.get<IBrand[]>(this.baseUrl + "products/brands");
  }

  getTypes () {
    return this.http.get<IProductType[]>(this.baseUrl + "products/types");
  }
}

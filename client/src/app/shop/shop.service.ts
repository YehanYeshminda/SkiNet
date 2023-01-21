import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, map } from 'rxjs';
import { IBrand } from '../shared/models/brand';
import { IPagination } from '../shared/models/pagination';
import { IProductType } from '../shared/models/productType';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl: string = "https://localhost:5001/api/"

  constructor(private http: HttpClient) { }

  getProducts (brandId?: number, typeId?:number, sort?:string) {
    let parameters = new HttpParams();

    if (brandId) {
      parameters = parameters.append('brandId', brandId.toString());
    }

    if (typeId) {
      parameters = parameters.append("typeId", typeId.toString());
    }

    if (sort) {
      parameters = parameters.append("sort", sort)
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

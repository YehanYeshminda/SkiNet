import { Component, OnInit } from '@angular/core';
import { IBrand } from '../shared/models/brand';
import { IPagination } from '../shared/models/pagination';
import { IProduct } from '../shared/models/product';
import { IProductType } from '../shared/models/productType';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  products: IProduct[];
  brands: IBrand[];
  types: IProductType[];
  brandIdSelected: number;
  typeIdSelected: number;

  constructor(private shopService: ShopService) {}

  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getTypes();
  }

  getProducts() {
    // these are optional to pass which is the brandid and the typeid
    this.shopService
      .getProducts(this.brandIdSelected, this.typeIdSelected)
      .subscribe(
        (res: IPagination) => {
          this.products = res.data;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  getBrands() {
    this.shopService.getBrands().subscribe(
      (res: IBrand[]) => {
        this.brands = [{ id: 0, name: 'All' }, ...res];
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getTypes() {
    this.shopService.getTypes().subscribe(
      (res: IProductType[]) => {
        this.types = [{ id: 0, name: 'All' }, ...res];
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onBrandSelected(brandId: number) {
    this.brandIdSelected = brandId;
    this.getProducts(); // this will fetch the brands selected;
  }

  onTypeSelected(typeId: number) {
    this.typeIdSelected = typeId;
    this.getProducts();
  }
}

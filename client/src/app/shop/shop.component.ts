import { Component, OnInit } from '@angular/core';
import { IBrand } from '../shared/models/brand';
import { IPagination } from '../shared/models/pagination';
import { IProduct } from '../shared/models/product';
import { IProductType } from '../shared/models/productType';
import { ShopParams } from '../shared/models/shopParams';
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
  shopParams = new ShopParams();
  totalCount: number;
  
  sortOptions = [
    {
      name: 'Alphabetical', value: 'name'
    },
    { 
      name: 'Price: Low to High', value: 'priceAsc' 
    },
    { 
      name: 'Price: High to Low', value: 'priceDesc' 
    }
  ]

  constructor(private shopService: ShopService) {}

  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getTypes();
  }

  getProducts() {
    // these are optional to pass which is the brand id and the typeid
    this.shopService
      .getProducts(this.shopParams)
      .subscribe(
        (res: IPagination) => {
          this.products = res.data
          this.shopParams.pageNumber = res.pageIndex;
          this.shopParams.pageSize = res.pageSize;
          this.totalCount = res.count;
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
    this.shopParams.brandId = brandId;
    this.getProducts(); // this will fetch the brands selected;
  }

  onTypeSelected(typeId: number) {
    this.shopParams.typeId = typeId;
    this.getProducts();
  }

  onSortSelected(sort: string) {
    this.shopParams.sort = sort;
    this.getProducts();
  }

  onPageChanged(event: any) {
    this.shopParams.pageNumber = event.page;
    this.getProducts();
  }
}

import { Component, OnInit } from '@angular/core';
import { BasketService } from './basket/basket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'SkiNet';

  constructor(private basketService: BasketService) {}
  ngOnInit(): void {
    const basketId = localStorage.getItem('basket_id');
    if (basketId) {
      // this is in order to check if the basketId exists
      this.basketService.getBasket(basketId).subscribe({
        next: () => {
          // this is in order to subscribe to the observable
          console.log('initialized basket');
        },
        error: (error) => {
          // this is in order to log the error in the console
          console.log(error);
        },
      });
    }
  }
}

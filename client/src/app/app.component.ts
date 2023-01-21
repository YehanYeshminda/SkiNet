import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private http: HttpClient) {}

  title = 'SkiNet';
  products: any = []

  ngOnInit(): void {
    this.http.get('https://localhost:5001/api/Products?pageSize=50').subscribe((response: any) => {
      this.products = response.data;
    });
  }
}

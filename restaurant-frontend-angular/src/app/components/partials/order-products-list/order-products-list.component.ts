import { Component, Input, OnInit } from '@angular/core';
import { Cart } from 'src/app/models/Cart';
import { Order } from 'src/app/models/Order';
import { ImageProcessingService } from 'src/app/services/image-processing.service';

@Component({
  selector: 'order-products-list',
  templateUrl: './order-products-list.component.html',
  styleUrls: ['./order-products-list.component.scss']
})
export class OrderProductsListComponent implements OnInit {

  @Input()
  order!: Order;

  @Input()
  cart!: Cart;

  constructor(private imageProcessingService: ImageProcessingService) { }

  ngOnInit(): void {
    this.cart.products.forEach((product) => {
      product.image = this.imageProcessingService.createImage(product.item).itemImages[0];
    });
  }

}

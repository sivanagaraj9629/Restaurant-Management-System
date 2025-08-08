import { Component, OnInit } from '@angular/core';
import { Cart } from 'src/app/models/Cart';
import { CartProduct } from 'src/app/models/CartProduct';
import { CartService } from 'src/app/services/cart.service';
import { ImageProcessingService } from 'src/app/services/image-processing.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss']
})
export class CartPageComponent implements OnInit {

  cart!: Cart;

  constructor(private cartService: CartService, private imageProcessingService: ImageProcessingService, tokenService: TokenService) {
    tokenService.handleTokenValidityBeforePageLoad();
    /* Update the cart every time we have a new value */
    this.cartService.getCartObservable().subscribe((cart) => {
      this.cart = cart;
    });
  }

  ngOnInit(): void {
    this.cart.products.forEach((product) => {
      product.image = this.imageProcessingService.createImage(product.item).itemImages[0];
    });
  }

  removeFromCart(cartProduct: CartProduct) {
    this.cartService.removeFromCart(cartProduct.item.id);
  }

  changeQuantity(cartProduct: CartProduct, quantity: string) {
    this.cartService.changeQuantity(cartProduct.item.id, parseInt(quantity));
  }

}

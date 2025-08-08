import { Injectable } from '@angular/core';
import { Cart } from '../models/Cart';
import { BehaviorSubject, Observable } from 'rxjs';
import { Item } from '../models/Item';
import { CartProduct } from '../models/CartProduct';
import { ImageProcessingService } from './image-processing.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cart: Cart = this.getCartFromLocalStorage();  // Initializing cart with data from local storage or a new empty cart
  private cartSubject: BehaviorSubject<Cart> = new BehaviorSubject(this.cart);

  constructor(private imageProcessingService: ImageProcessingService) { }

  addToCart(item: Item): void {
    /* Check if item already exists in the cart. If item exists, exit the method */
    let cartProduct = this.cart.products.find(product => product.item.id === item.id);
    if(cartProduct)
      return;

    /* If item doesn't exist, add it to the cart and update cart in local storage */
    this.cart.products.push(new CartProduct(item));
    //console.log("immagine: " + JSON.stringify(this.getCart().products[0].image));
    this.setCartToLocalStorage();
  }

  removeFromCart(itemId: number): void {
    /* Filtering out the item to be removed from the cart */
    this.cart.products = this.cart.products.filter(product => product.item.id != itemId);
    this.setCartToLocalStorage();
  }

  changeQuantity(itemId: number, quantity: number) {
    /* Find the cart product by item ID. If item is not found in cart, exit the method */
    let cartProduct = this.cart.products.find(product => product.item.id === itemId);
    if (!cartProduct)
      return;

    /* If item is found, update its quantity and price */
    cartProduct.quantity = quantity;
    cartProduct.price = quantity * cartProduct.item.price;
    this.setCartToLocalStorage();
  }

  clearCart() {
    this.cart = new Cart();
    this.setCartToLocalStorage();
  }

  getCartObservable(): Observable<Cart> {
    return this.cartSubject.asObservable();
  }

  /* Returns the current/latest value of the cart subject */
  getCart(): Cart{
    return this.cartSubject.value;
  }

  private setCartToLocalStorage(): void {
    /* Calculate total price and total count of products in the cart */
    this.cart.totalPrice = this.cart.products.reduce((prevSum, currentItem) => prevSum + currentItem.price, 0);
    this.cart.totalCount = this.cart.products.reduce((prevSum, currentItem) => prevSum + currentItem.quantity, 0);

    const cartJson = JSON.stringify(this.cart); // Converting cart object to json string
    localStorage.setItem('cart', cartJson);
    /* When we set something to the local storage it means we're changing the cart,
     * anybody who's listening to the cart observable should be notified. To notify all
     * the listeners of the cart observable we use */
    this.cartSubject.next(this.cart); // Emit the updated cart through the BehaviorSubject
  }

  private getCartFromLocalStorage(): Cart {
    const cartJson = localStorage.getItem('cart');
    /* Parse json data to Cart object or returning a new empty cart if no data found */
    return cartJson ? JSON.parse(cartJson) : new Cart();
  }

}
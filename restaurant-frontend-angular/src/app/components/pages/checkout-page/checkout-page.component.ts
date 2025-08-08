import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Cart } from 'src/app/models/Cart';
import { Order } from 'src/app/models/Order';
import { User } from 'src/app/models/User';
import { BillService } from 'src/app/services/bill.service';
import { CartService } from 'src/app/services/cart.service';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants, OrderStatus } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.scss']
})
export class CheckoutPageComponent implements OnInit {

  checkoutForm!: FormGroup;
  currentUser!: User;
  cart: Cart;
  order: Order = new Order();

  constructor(private tokenService: TokenService, private formBuilder: FormBuilder, private userService: UserService,
    private cartService: CartService, private billService: BillService, private router: Router, private toastrService: ToastrService) {
    this.tokenService.handleTokenValidityBeforePageLoad();
    this.getCurrentUser();
    this.cart = cartService.getCart();
    this.order.products = this.cart.products;
    this.order.totalPrice = this.cart.totalPrice;
  }

  ngOnInit(): void {
    this.checkoutForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      contactNumber: ['', Validators.required],
      paymentMethod: ['Cash', Validators.required]
    }, {
      validator: this.validateForm
    });
  }

  validateForm(form: FormGroup) {
    const name = form.controls['name'].value;
    const address = form.controls['address'].value;
    const contactNumber = form.controls['contactNumber'].value;

    if(name !== null && !/^[a-zA-Z\s]+$/.test(name))
      form.controls['name'].setErrors({ namePattern: true });
    if(address !== null && !/^[0-9A-Za-z\s\.,#\-]+$/.test(address))
      form.controls['address'].setErrors({ addressPattern: true });
    if(contactNumber !== '' && !/^\d+$/.test(contactNumber))
      form.controls['contactNumber'].setErrors({ contactNumberPattern: true });
  }

  getCurrentUser() {
    this.userService.getCurrentUser().subscribe((response: User) => {
        this.currentUser = response;
        /* Once the currentUser is retrieved, set the form values */
        this.checkoutForm.patchValue({
          name: this.currentUser.name,
          email: this.currentUser.email,
          address: this.currentUser.address,
          contactNumber: this.currentUser.contactNumber
        });
      }, (error: any) => {
        console.error(error);
      }
    );
  }

  get fc() {
    return this.checkoutForm.controls;
  }

  createOrder() {
    if(this.checkoutForm.invalid) {
      this.toastrService.warning(GlobalConstants.invalidForm);
      return;
    }

    const data = {
      name: this.fc['name'].value,
      email: this.fc['email'].value,
      address: this.fc['address'].value,
      contactNumber: this.fc['contactNumber'].value,
      totalAmount: this.cart.totalPrice.toFixed(2),
      paymentMethod: this.fc['paymentMethod'].value,
      itemDetails: JSON.stringify(this.getItemDetails())
    };

    this.billService.generateReport(data).subscribe((response: any) => {
      this.router.navigate(['/bills']);
      this.toastrService.success(GlobalConstants.orderSent);
      this.checkoutForm.reset();
      this.cartService.clearCart();
    }, (error: any) => {
      console.error(error);
      if (error.error?.message)
        this.toastrService.error(error.error?.message);
      else
        this.toastrService.error(GlobalConstants.genericError);
    });
  }

  getItemDetails(): any {
    let items: any[] = [];
    this.cart.products.forEach((product) => {
      items.push({
        id: product.item.id,
        name: product.item.name,
        category: product.item.categoryName,
        quantity: product.quantity,
        price: product.item.price, 
        total: product.quantity * product.item.price
      });
    });
    return items;
  }

}
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicModule } from "@ionic/angular";
import { ToastrModule } from "ngx-toastr";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BillDialogComponent } from "./components/dialogs/bill-dialog/bill-dialog.component";
import { CategoryDialogComponent } from "./components/dialogs/category-dialog/category-dialog.component";
import { ConfirmationDialogComponent } from "./components/dialogs/confirmation-dialog/confirmation-dialog.component";
import { ItemDialogComponent } from "./components/dialogs/item-dialog/item-dialog.component";
import { BillsPageComponent } from "./components/pages/bills-page/bills-page.component";
import { CartPageComponent } from "./components/pages/cart-page/cart-page.component";
import { CategoriesPageComponent } from "./components/pages/categories-page/categories-page.component";
import { ChangePasswordPageComponent } from "./components/pages/change-password-page/change-password-page.component";
import { CheckoutPageComponent } from "./components/pages/checkout-page/checkout-page.component";
import { DashboardPageAdminComponent } from "./components/pages/dashboard-page-admin/dashboard-page-admin.component";
import { DashboardPageUserComponent } from "./components/pages/dashboard-page-user/dashboard-page-user.component";
import { ForgotPasswordPageComponent } from "./components/pages/forgot-password-page/forgot-password-page.component";
import { HomePageComponent } from "./components/pages/home-page/home-page.component";
import { ItemsPageComponent } from "./components/pages/items-page/items-page.component";
import { LoginPageComponent } from "./components/pages/login-page/login-page.component";
import { ResetPasswordPageComponent } from "./components/pages/reset-password-page/reset-password-page.component";
import { SignupPageComponent } from "./components/pages/signup-page/signup-page.component";
import { UsersPageComponent } from "./components/pages/users-page/users-page.component";
import { DefaultButtonComponent } from "./components/partials/default-button/default-button.component";
import { HeaderComponent } from "./components/partials/header/header.component";
import { InputContainerComponent } from "./components/partials/input-container/input-container.component";
import { InputValidationComponent } from "./components/partials/input-validation/input-validation.component";
import { OrderProductsListComponent } from "./components/partials/order-products-list/order-products-list.component";
import { SidebarComponent } from "./components/partials/sidebar/sidebar.component";
import { TextInputComponent } from "./components/partials/text-input/text-input.component";



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomePageComponent,
    LoginPageComponent,
    InputContainerComponent,
    InputValidationComponent,
    TextInputComponent,
    DefaultButtonComponent,
    SignupPageComponent,
    DashboardPageAdminComponent,
    DashboardPageUserComponent,
    ForgotPasswordPageComponent,
    ResetPasswordPageComponent,
    ChangePasswordPageComponent,
    CategoriesPageComponent,
    SidebarComponent,
    CategoryDialogComponent,
    ConfirmationDialogComponent,
    ItemsPageComponent,
    ItemDialogComponent,
    CartPageComponent,
    CheckoutPageComponent,
    OrderProductsListComponent,
    BillsPageComponent,
    BillDialogComponent,
    UsersPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right'
    }),
    HttpClientModule,
    IonicModule,
    MatDialogModule,
    MatButtonModule,
    MatToolbarModule,
    FlexLayoutModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatOptionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

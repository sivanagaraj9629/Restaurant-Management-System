import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/models/Category';
import { Item } from 'src/app/models/Item';
import { CategoryService } from 'src/app/services/category.service';
import { ImageProcessingService } from 'src/app/services/image-processing.service';
import { ItemService } from 'src/app/services/item.service';
import { TokenService } from 'src/app/services/token.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { map } from 'rxjs/operators';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-dashboard-page-user',
  templateUrl: './dashboard-page-user.component.html',
  styleUrls: ['./dashboard-page-user.component.scss']
})
export class DashboardPageUserComponent {

  filteredCategories: Category[] = [];
  itemsGroupedByCategory: Map<number, Item[]> = new Map<number, Item[]>();

  constructor(private tokenService: TokenService, private categoryService: CategoryService, private itemService: ItemService, private toastrService: ToastrService,
    private imageProcessingService: ImageProcessingService, private cartService: CartService) {
    this.tokenService.handleTokenValidityBeforePageLoad();
    this.getFilteredCategories();
  }

  getFilteredCategories() {
    this.categoryService.getFilteredCategories().subscribe((response: any) => {
      this.filteredCategories = response;
      this.dashboardData();
    }, (error: any) => {
      console.log(error);
      if (error.error?.message)
        this.toastrService.error(error.error?.message);
      else
        this.toastrService.error(GlobalConstants.genericError);
    });
  }

  dashboardData() {
    this.itemService.getItemsGroupedByCategory(this.extractIds())
    .pipe(
      map((response: any) => {
        return Object.entries(response).map(([key, value]: [string, unknown]) => [parseInt(key), (value as Item[]).map(item => this.imageProcessingService.createImage(item))] as [number, Item[]]);
      })
    )
    .subscribe((response: [number, Item[]][]) => {
      this.itemsGroupedByCategory = new Map<number, Item[]>(response);
    }, (error: any) => {
      console.log(error);
      if (error.error?.message)
        this.toastrService.error(error.error?.message);
      else
        this.toastrService.error(GlobalConstants.genericError);
    });
  }

  extractIds(): number[] {
    const categoryIds = this.filteredCategories.map(category => category.id);
    return categoryIds;
  }

  addToCart(item: Item) {
    this.cartService.addToCart(item);
  }

  removeSpacesAndUppercase(name: string): string {
    /* Remove spaces and convert to lowercase*/
    return name.replace(/\s+/g, '-').toLowerCase();
  }

}

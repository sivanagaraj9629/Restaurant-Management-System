import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/models/Category';
import { CategoryService } from 'src/app/services/category.service';
import { TokenService } from 'src/app/services/token.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { CategoryDialogComponent } from '../../dialogs/category-dialog/category-dialog.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-categories-page',
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.scss']
})
export class CategoriesPageComponent {

  categories: Category[] = [];
  inputValue: string = '';
  originalCategories: Category[] = [];

  constructor(private tokenService: TokenService, private categoryService: CategoryService, private toastrService: ToastrService,
    private dialog: MatDialog, private router: Router) {
    this.tokenService.handleTokenValidityBeforePageLoad();
    this.getAllCategories();
  }

  getAllCategories() {
    this.categoryService.getAllCategories().subscribe((response: any) => {
      this.categories = response;
      /* Save original categories for resetting */
      this.originalCategories = [...response];
    }, (error: any) => {
      console.log(error);
      if (error.error?.message)
        this.toastrService.error(error.error?.message);
      else
        this.toastrService.error(GlobalConstants.genericError);
    });
  }

  handleAddCategory() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add'
    };
    dialogConfig.width = "25rem";
    dialogConfig.position = { left: '45%' };
    const dialogRef = this.dialog.open(CategoryDialogComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    /* This ensures that the newly added category is immediately reflected in the list without requiring a page reload */
    const sub = dialogRef.componentInstance.onAddCategory.subscribe((response) => {
      this.getAllCategories();
    });
  }

  handleEditCategory(category: Category) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data: category
    };
    dialogConfig.width = "25rem";
    dialogConfig.position = { left: '45%' };
    const dialogRef = this.dialog.open(CategoryDialogComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    /* This ensures that the newly added category is immediately reflected in the list without requiring a page reload */
    const sub = dialogRef.componentInstance.onEditCategory.subscribe((response) => {
      this.getAllCategories();
    });
  }

  handleDeleteCategory(category: Category) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'delete ' + category.name,
      confirmation: true
    };
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      this.deleteCategory(category.id);
      dialogRef.close();
    });
  }

  deleteCategory(id: number) {
    this.categoryService.deleteCategory(id).subscribe((response: any) => {
      this.getAllCategories();
      this.toastrService.success(response?.message);
    }, (error: any) => {
      console.error(error);
      if (error.error?.message)
        this.toastrService.error(error.error?.message);
      else
        this.toastrService.error(GlobalConstants.genericError);
    });
  }

  /*applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.categories = this.categories.filter(category =>
      category.name.toLowerCase().includes(filterValue)
    );
  }*/

  handleFilterValueChanges() {
    /* Reset categories to the original list before applying the filter */
    this.categories = [...this.originalCategories];

    /* Apply the filter based on the input value */
    this.categories = this.categories.filter(category =>
      category.id.toString().toLowerCase().includes(this.inputValue.trim().toLowerCase()) ||
      category.name.toLowerCase().includes(this.inputValue.trim().toLowerCase())
    );
  }

}

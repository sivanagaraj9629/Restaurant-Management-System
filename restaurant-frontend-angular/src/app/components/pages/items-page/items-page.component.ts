import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Item } from 'src/app/models/Item';
import { ItemService } from 'src/app/services/item.service';
import { TokenService } from 'src/app/services/token.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ItemDialogComponent } from '../../dialogs/item-dialog/item-dialog.component';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-items-page',
  templateUrl: './items-page.component.html',
  styleUrls: ['./items-page.component.scss']
})
export class ItemsPageComponent {

  items: Item[] = [];
  inputValue: string = '';
  originalItems: Item[] = [];

  constructor(private tokenService: TokenService, private itemService: ItemService, private toastrService: ToastrService, private router: Router,
    private dialog: MatDialog) {
    this.tokenService.handleTokenValidityBeforePageLoad();
    this.getAllItems();
  }

  getAllItems() {
    this.itemService.getAllItems().subscribe((response: any) => {
      this.items = response;
      /* Save original categories for resetting */
      this.originalItems = [...response];
    }, (error: any) => {
      console.log(error);
      if (error.error?.message)
        this.toastrService.error(error.error?.message);
      else
        this.toastrService.error(GlobalConstants.genericError);
    });
  }

  handleFilterValueChanges() {
    /* Reset items to the original list before applying the filter */
    this.items = [...this.originalItems];

    /* Apply the filter based on the input value */
    this.items = this.items.filter(item =>
      item.name.toLowerCase().includes(this.inputValue.trim().toLowerCase()) ||
      item.id.toString().toLowerCase().includes(this.inputValue.trim().toLowerCase()) ||
      item.price.toString().toLowerCase().includes(this.inputValue.trim().toLowerCase()) ||
      item.description.toLowerCase().includes(this.inputValue.trim().toLowerCase()) ||
      item.categoryName.toLowerCase().includes(this.inputValue.trim().toLowerCase()) ||
      item.status.toLowerCase().includes(this.inputValue.trim().toLowerCase())
    );
  }

  handleAddItem() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Add'
    };
    dialogConfig.width = "25rem";
    dialogConfig.position = { left: '45%' };
    const dialogRef = this.dialog.open(ItemDialogComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    /* This ensures that the newly added category is immediately reflected in the list without requiring a page reload */
    const sub = dialogRef.componentInstance.onAddItem.subscribe((response) => {
      this.getAllItems();
    });
  }

  handleDeleteItem(item: Item) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'delete ' + item.name,
      confirmation: true
    };
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      this.deleteItem(item.id);
      dialogRef.close();
    });
  }

  deleteItem(id: number) {
    this.itemService.deleteItem(id).subscribe((response: any) => {
      this.getAllItems();
      this.toastrService.success(response?.message);
    }, (error: any) => {
      console.error(error);
      if (error.error?.message)
        this.toastrService.error(error.error?.message);
      else
        this.toastrService.error(GlobalConstants.genericError);
    });
  }

  handleEditItem(item: Item) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Edit',
      data: item
    };
    dialogConfig.width = "25rem";
    dialogConfig.position = { left: '45%' };
    const dialogRef = this.dialog.open(ItemDialogComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
    /* This ensures that the newly added category is immediately reflected in the list without requiring a page reload */
    const sub = dialogRef.componentInstance.onEditItem.subscribe((response) => {
      this.getAllItems();
    });
  }

}

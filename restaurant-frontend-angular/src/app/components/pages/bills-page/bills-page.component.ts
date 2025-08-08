import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Bill } from 'src/app/models/Bill';
import { AuthService } from 'src/app/services/auth.service';
import { BillService } from 'src/app/services/bill.service';
import { TokenService } from 'src/app/services/token.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { BillDialogComponent } from '../../dialogs/bill-dialog/bill-dialog.component';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-bills-page',
  templateUrl: './bills-page.component.html',
  styleUrls: ['./bills-page.component.scss'],
  providers: [DatePipe]
})
export class BillsPageComponent {

  bills: Bill[] = [];
  role!: string;

  constructor(private billService: BillService, private tokenService: TokenService, private datePipe: DatePipe, private dialog: MatDialog,
    private toastrService: ToastrService, private router: Router, private authService: AuthService) {
    this.tokenService.handleTokenValidityBeforePageLoad();
    this.authService.getRole().subscribe(role => {
      this.role = role;
    });
    this.getAllBills();
  }

  getAllBills() {
    this.billService.getAllBills().subscribe((response: any) => {
        /* Map over the bills and format the date */
        this.bills = response.map((bill: Bill) => {
          return {
            ...bill,
            issueDate: this.formatDate(bill.issueDate),
            total: bill.total.toFixed(2)
          }
        });
      }, (error: any) => {
        console.error(error);
        if (error.error?.message)
          this.toastrService.error(error.error?.message);
        else
          this.toastrService.error(GlobalConstants.genericError);
      });
  }

  formatDate(date: string): string {
    const dateToFormat = new Date(date);
    return this.datePipe.transform(dateToFormat, 'yyyy-MM-dd HH:mm') || '';
  }

  handleDeleteBill(bill: Bill) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'proceed with deleting the bill',
      confirmation: true
    };
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response) => {
      this.deleteBill(bill.id);
      dialogRef.close();
    });
  }

  deleteBill(id: number) {
    this.billService.deleteBill(id).subscribe((response: any) => {
      this.getAllBills();
      this.toastrService.success(response?.message);
    }, (error: any) => {
      console.error(error);
      if (error.error?.message)
        this.toastrService.error(error.error?.message);
      else
        this.toastrService.error(GlobalConstants.genericError);
    });
  }

  handleViewBill(uuid: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      uuid: uuid
    };
    dialogConfig.position = { left: '40%' };
    const dialogRef = this.dialog.open(BillDialogComponent, dialogConfig);
    this.router.events.subscribe(() => {
      dialogRef.close();
    });
  }
  
}
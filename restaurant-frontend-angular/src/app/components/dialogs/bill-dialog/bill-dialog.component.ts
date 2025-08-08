import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { BillService } from 'src/app/services/bill.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-bill-dialog',
  templateUrl: './bill-dialog.component.html',
  styleUrls: ['./bill-dialog.component.scss']
})
export class BillDialogComponent implements OnInit {

  pdfData: any;
  pdfUrl!: SafeResourceUrl;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any, private sanitizer: DomSanitizer, private billService: BillService, private toastrService: ToastrService) { }

  ngOnInit(): void {
    const data = {
      uuid: this.dialogData.uuid
    };

    this.billService.getPdf(data).subscribe(
      (response: any) => {
        this.pdfData = new Blob([response], { type: 'application/pdf' });
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(this.pdfData));
      },
      (error) => {
        console.error(error);
      if (error.error?.message)
        this.toastrService.error(error.error?.message);
      else
        this.toastrService.error(GlobalConstants.pdfError);
      });
  }

}
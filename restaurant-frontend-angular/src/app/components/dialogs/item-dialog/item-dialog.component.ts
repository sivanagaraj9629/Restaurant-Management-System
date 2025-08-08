import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/models/Category';
import { CategoryService } from 'src/app/services/category.service';
import { ItemService } from 'src/app/services/item.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-item-dialog',
  templateUrl: './item-dialog.component.html',
  styleUrls: ['./item-dialog.component.scss']
})
export class ItemDialogComponent {

  onAddItem = new EventEmitter();
  onEditItem = new EventEmitter();
  itemForm!: FormGroup;
  dialogAction: string = "Add";
  action: string = "Add";
  categories: Category[] = [];
  selectedFileName: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any, private formBuilder: FormBuilder, private itemService: ItemService, private categoryService: CategoryService,
    public dialogRef: MatDialogRef<ItemDialogComponent>, private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.itemForm = this.formBuilder.group({
      name: ['', Validators.required],
      categoryId: ['', Validators.required],
      price: ['', Validators.required],
      description: [null],
      status: ['false'],
      image: ['']
    }, {
      validator: this.validateForm
    });
    if (this.dialogData.action === 'Edit') {
      this.dialogAction = "Edit";
      this.action = "Update";
      this.itemForm.patchValue(this.dialogData.data);
    }
    this.getAllCategories();
  }

  validateForm(form: FormGroup) {
    const name = form.controls['name'].value;
    const price = form.controls['price'].value;
    const description = form.controls['description'].value;

    if (name !== '' && !/^[a-zA-Z\s]+$/.test(name))
      form.controls['name'].setErrors({ namePattern: true });
    if (price !== '' && !/^\d+(\.\d+)?$/.test(price))
      form.controls['price'].setErrors({ pricePattern: true });
    if (description !== '' && !/^[\p{L}\s(),\-']+$/u.test(description))
      form.controls['description'].setErrors({ descriptionPattern: true });
  }

  get fc() {
    return this.itemForm.controls;
  }

  getAllCategories() {
    this.categoryService.getAllCategories().subscribe((response: any) => {
      this.categories = response;
    }, (error: any) => {
      console.log(error);
      if (error.error?.message)
        this.toastrService.error(error.error?.message);
      else
        this.toastrService.error(GlobalConstants.genericError);
    });
  }

  handleSubmit() {
    if (this.dialogAction === "Edit")
      this.editItem();
    else
      this.addItem();
  }

  addItem() {
    const formData = this.itemForm.value;
    const data = {
      name: formData.name,
      categoryId: formData.categoryId,
      price: formData.price,
      description: formData.description,
      status: formData.status
    };

    this.itemService.addItem(data).subscribe((response: any) => {
      this.toastrService.success(response?.message);
      if(this.selectedFileName!='')
        this.addImage(response.id);
      this.dialogRef.close();
      this.onAddItem.emit();
    }, (error: any) => {
      this.dialogRef.close();
      console.error(error);
      if (error.error?.message)
        this.toastrService.error(error.error?.message);
      else
        this.toastrService.error(GlobalConstants.genericError);
    });
  }

  addImage(id: number) {
    this.itemService.addImageToItem(id, this.itemForm.value.image).subscribe((response: any) => {
      this.toastrService.success(response?.message);
    }, (error: any) => {
      console.error(error);
      if (error.error?.message)
        this.toastrService.error(error.error?.message);
      else
        this.toastrService.error(GlobalConstants.genericError);
    });
  }

  onStatusChange(checked: boolean) {
    this.itemForm.get('status')?.setValue(checked.toString());
    this.itemForm.markAsDirty();
  }

  editItem() {
    const formData = this.itemForm.value;
    const data = {
      id: this.dialogData.data.id,
      name: formData.name,
      categoryId: formData.categoryId,
      price: formData.price,
      description: formData.description,
      status: formData.status
    };

    this.itemService.updateItem(data).subscribe((response: any) => {
      this.dialogRef.close();
      this.onEditItem.emit();
      this.toastrService.success(response?.message);
      if(this.selectedFileName!='')
        this.addImage(data.id);
    }, (error: any) => {
      this.dialogRef.close();
      console.error(error);
      if (error.error?.message)
        this.toastrService.error(error.error?.message);
      else
        this.toastrService.error(GlobalConstants.genericError);
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
      this.itemForm.get('image')?.setValue(file);
      this.itemForm.markAsDirty();
    }
  }

}
import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from 'src/app/services/category.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.scss']
})
export class CategoryDialogComponent {

  onAddCategory = new EventEmitter();
  onEditCategory = new EventEmitter();
  categoryForm!: FormGroup;
  dialogAction: string = "Add";
  action: string = "Add";

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any, private formBuilder: FormBuilder, private categoryService: CategoryService,
    public dialogRef: MatDialogRef<CategoryDialogComponent>, private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
    }, {
      validator: this.validateForm
    });
    if(this.dialogData.action === 'Edit') {
      this.dialogAction = "Edit";
      this.action = "Update";
      this.categoryForm.patchValue(this.dialogData.data);
    }
  }

  validateForm(form: FormGroup) {
    const name = form.controls['name'].value;

    if (name !== '' && !/^[a-zA-Z\s]+$/.test(name))
      form.controls['name'].setErrors({ pattern: true });
  }

  get fc() {
    return this.categoryForm.controls;
  }

  handleSubmit() {
    if(this.dialogAction === "Edit")
      this.editCategory();
    else
      this.addCategory();
  }

  addCategory() {
    this.categoryService.addCategory({ name: this.categoryForm.value.name }).subscribe((response: any) => {
      this.dialogRef.close();
      this.onAddCategory.emit();
      this.toastrService.success(response?.message);
    }, (error: any) => {
      this.dialogRef.close();
      console.error(error);
      if (error.error?.message)
        this.toastrService.error(error.error?.message);
      else
        this.toastrService.error(GlobalConstants.genericError);
    });
  }

  editCategory() {
    const data = {
      id: this.dialogData.data.id,
      name: this.categoryForm.value.name
    };
    
    this.categoryService.updateCategory(data).subscribe((response: any) => {
      this.dialogRef.close();
      this.onEditCategory.emit();
      this.toastrService.success(response?.message);
    }, (error: any) => {
      this.dialogRef.close();
      console.error(error);
      if (error.error?.message)
        this.toastrService.error(error.error?.message);
      else
        this.toastrService.error(GlobalConstants.genericError);
    });
  }

}

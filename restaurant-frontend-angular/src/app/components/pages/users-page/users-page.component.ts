import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/User';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss']
})
export class UsersPageComponent {

  users: User[] = [];
  inputValue: string = '';
  originalUsers: User[] = [];

  constructor(tokenService: TokenService, private userService: UserService, private toastrService: ToastrService) {
    tokenService.handleTokenValidityBeforePageLoad();
    this.getAllUsers();
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe((response: any) => {
      this.users = response;
      this.originalUsers = [...response];
    }, (error: any) => {
      console.error(error);
      if (error.error?.message)
        this.toastrService.error(error.error?.message);
      else
        this.toastrService.error(GlobalConstants.genericError);
    });
  }

  handleFilterValueChanges() {
    this.users = [...this.originalUsers];
    this.users = this.users.filter(user =>
      user.id.toString().toLowerCase().includes(this.inputValue.trim().toLowerCase()) ||
      user.name.toLowerCase().includes(this.inputValue.trim().toLowerCase()) ||
      user.email.toLowerCase().includes(this.inputValue.trim().toLowerCase()) ||
      user.contactNumber.toString().toLowerCase().includes(this.inputValue.trim().toLowerCase()) ||
      user.role.toLowerCase().includes(this.inputValue.trim().toLowerCase()) ||
      user.status.toLowerCase().includes(this.inputValue.trim().toLowerCase()) ||
      user.address!=null && user.address.toLowerCase().includes(this.inputValue.trim().toLowerCase())
    );
  }

  onStatusChange(checked: boolean, id: number) {
    const data = {
      status: checked.toString(),
      id: id
    };
    this.userService.updateStatus(data).subscribe((response: any) => {
      this.toastrService.success(response?.message);
      this.getAllUsers();
    }, (error: any) => {
      console.error(error);
      if (error.error?.message)
        this.toastrService.error(error.error?.message);
      else
        this.toastrService.error(GlobalConstants.genericError);
    });
  }

}

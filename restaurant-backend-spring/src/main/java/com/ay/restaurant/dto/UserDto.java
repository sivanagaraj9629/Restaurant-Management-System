package com.ay.restaurant.dto;

import com.ay.restaurant.pojo.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private Integer id;
    private String name;
    private String email;
    private String address;
    private String contactNumber;
    private String status;
    private String role;

    public UserDto(User user) {
        this.name = user.getName();
        this.email = user.getEmail();
        this.address = user.getAddress();
        this.contactNumber = user.getContactNumber();
        this.role = user.getRole();
    }

}
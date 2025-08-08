package com.ay.restaurant.service;

import com.ay.restaurant.dto.UserDto;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface UserService {

    public ResponseEntity<String> signUp(Map<String,String> requestMap);

    public ResponseEntity<String> login(Map<String,String> requestMap);

    public ResponseEntity<List<UserDto>> getAllUsers();

    public ResponseEntity<String> updateStatus(Map<String,String> requestMap);

    public ResponseEntity<String> checkToken();

    public ResponseEntity<String> changePassword(Map<String,String> requestMap);

    public ResponseEntity<String> forgotPassword(Map<String,String> requestMap);

    public ResponseEntity<String> resetPassword(Map<String,String> requestMap);

    public ResponseEntity<UserDto> getCurrentUser();

}

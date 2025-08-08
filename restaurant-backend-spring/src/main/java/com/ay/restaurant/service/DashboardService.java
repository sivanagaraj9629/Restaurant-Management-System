package com.ay.restaurant.service;

import org.springframework.http.ResponseEntity;

import java.util.Map;

public interface DashboardService {

    public ResponseEntity<Map<String,Object>> getDetails();

}

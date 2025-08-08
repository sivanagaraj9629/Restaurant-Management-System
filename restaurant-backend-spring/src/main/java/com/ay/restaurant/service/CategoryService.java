package com.ay.restaurant.service;

import com.ay.restaurant.pojo.Category;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface CategoryService {

    public ResponseEntity<String> addNewCategory(Map<String,String> requestMap);

    public ResponseEntity<List<Category>> getAllCategories(String filterList);

    public ResponseEntity<String> updateCategory(Map<String,String> requestMap);

    public ResponseEntity<String> deleteCategory(Integer id);

}

package com.ay.restaurant.rest;

import com.ay.restaurant.pojo.Category;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RequestMapping(path = "/categories")
public interface CategoryRest {

    @PostMapping(path = "/add")
    public ResponseEntity<String> addNewCategory(@RequestBody(required = true) Map<String,String> requestMap);

    @GetMapping(path = "/all")
    public ResponseEntity<List<Category>> getAllCategories(@RequestParam(required = false) String filterList);

    @PostMapping(path ="/update")
    public ResponseEntity<String> updateCategory(@RequestBody(required = true) Map<String,String> requestMap);

    @GetMapping(path = "/delete/{id}")
    public ResponseEntity<String> deleteCategory(@PathVariable Integer id);

}
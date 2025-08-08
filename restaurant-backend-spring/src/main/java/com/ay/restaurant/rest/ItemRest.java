package com.ay.restaurant.rest;

import com.ay.restaurant.dto.ItemDto;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;

import java.util.List;
import java.util.Map;

@RequestMapping(path = "/items")
public interface ItemRest {

    @PostMapping(path = "/add")
    public ResponseEntity<Object> addNewItem(@RequestBody(required = true) Map<String,String> requestMap);

    @PostMapping(path = "/addImage/{id}")
    public ResponseEntity<String> addImageToItem(@PathVariable Integer id, @RequestBody byte[] imageBytes);

    @GetMapping(path = "/all")
    public ResponseEntity<List<ItemDto>> getAllItems();

    @PostMapping(path = "/update")
    public ResponseEntity<String> updateItem(@RequestBody(required = true) Map<String,String> requestMap);

    @GetMapping(path = "/delete/{id}")
    public ResponseEntity<String> deleteItem(@PathVariable Integer id);

    @GetMapping(path = "/category/{id}")
    public ResponseEntity<List<ItemDto>> getByCategory(@PathVariable Integer id);

    @PostMapping(path = "/groupedBy")
    public ResponseEntity<Map<Integer, List<ItemDto>>> getItemsGroupedByCategory(@RequestBody(required = true) List<Integer> categoryIds);

    @GetMapping(path = "/{id}")
    public ResponseEntity<ItemDto> getItem(@PathVariable Integer id);

}
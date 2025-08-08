package com.ay.restaurant.service;

import com.ay.restaurant.dto.ItemDto;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface ItemService {

    public ResponseEntity<Object> addNewItem(Map<String,String> requestMap);

    public ResponseEntity<String> addImageToItem(Integer id, byte[] imageBytes);

    public ResponseEntity<List<ItemDto>> getAllItems();

    public ResponseEntity<String> updateItem(Map<String,String> requestMap);

    public ResponseEntity<String> deleteItem(Integer id);

    public ResponseEntity<List<ItemDto>> getByCategory(Integer id);

    public ResponseEntity<Map<Integer, List<ItemDto>>> getItemsGroupedByCategory(List<Integer> categoryIds);

    public ResponseEntity<ItemDto> getItem(Integer id);

}
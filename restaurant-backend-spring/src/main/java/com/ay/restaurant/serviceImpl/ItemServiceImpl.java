package com.ay.restaurant.serviceImpl;

import com.ay.restaurant.constants.RestaurantConstants;
import com.ay.restaurant.dao.CategoryDao;
import com.ay.restaurant.dao.ItemDao;
import com.ay.restaurant.dto.ItemDto;
import com.ay.restaurant.dto.UserDto;
import com.ay.restaurant.jwt.JwtFilter;
import com.ay.restaurant.pojo.Category;
import com.ay.restaurant.pojo.Item;
import com.ay.restaurant.service.ItemService;
import com.ay.restaurant.utils.RestaurantUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {

    private final JwtFilter jwtFilter;
    private final ItemDao itemDao;
    private final CategoryDao categoryDao;

    @Override
    public ResponseEntity<Object> addNewItem(Map<String,String> requestMap) {
        Map<String, Object> responseBody = new HashMap<>();
        try {
            if(jwtFilter.isAdmin()) {
                if(validateItemMap(requestMap, false)) {
                    Item newItem = getItemFromMap(requestMap, new Item());
                    Item createdItem = itemDao.save(newItem);

                    /* Response */
                    responseBody.put("message", "Item added successfully");
                    responseBody.put("id", createdItem.getId());
                    return ResponseEntity.ok().body(responseBody);
                }
                else
                    return RestaurantUtils.getResponseEntityObject(responseBody, RestaurantConstants.INVALID_DATA, HttpStatus.BAD_REQUEST);
            }
            else
                return RestaurantUtils.getResponseEntityObject(responseBody, RestaurantConstants.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
        } catch(Exception exception) {
            exception.printStackTrace();
        }
        return RestaurantUtils.getResponseEntityObject(responseBody, RestaurantConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private boolean validateItemMap(Map<String,String> requestMap, boolean validateId) {
        if(requestMap.containsKey("name") && requestMap.containsKey("price") && requestMap.containsKey("categoryId")) {
            if((requestMap.containsKey("id") && validateId) || !validateId)
                return true;
        }
        return false;
    }

    private Item getItemFromMap(Map<String,String> requestMap, Item item) {
        Optional<Category> optionalCategory = categoryDao.findById(Integer.parseInt(requestMap.get("categoryId")));
        item.setName(requestMap.get("name"));
        if (requestMap.containsKey("description")) {
            item.setDescription(requestMap.get("description"));
        }
        item.setPrice(Double.parseDouble(requestMap.get("price")));
        item.setStatus(requestMap.get("status"));
        if(!optionalCategory.isEmpty()) {
            item.setCategory(optionalCategory.get());
        }
        return item;
    }

    @Override
    public ResponseEntity<String> addImageToItem(Integer id, byte[] imageBytes) {
        try {
            Optional<Item> optionalItem = itemDao.findById(id);
            if (optionalItem.isPresent()) {
                Item item = optionalItem.get();
                //System.out.println("Image data length: " + imageBytes.length);
                if(imageBytes != null && imageBytes.length > 0) {
                    item.setImage(imageBytes);
                    itemDao.save(item);
                    return RestaurantUtils.getResponseEntity("Image added successfully", HttpStatus.OK);
                }
                else {
                    return RestaurantUtils.getResponseEntity("Image file is empty", HttpStatus.BAD_REQUEST);
                }
            }
            else {
                return RestaurantUtils.getResponseEntity("Item id does not exist", HttpStatus.NOT_FOUND);
            }
        } catch (Exception exception) {
            exception.printStackTrace();
            return RestaurantUtils.getResponseEntity(RestaurantConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<List<ItemDto>> getAllItems() {
        try {
            return new ResponseEntity<>(itemDao.findAllItems(), HttpStatus.OK);
        } catch(Exception exception) {
            exception.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> updateItem(Map<String,String> requestMap) {
        try {
            if(jwtFilter.isAdmin()) {
                if(validateItemMap(requestMap, true)) {
                    Optional<Item> optionalItem = itemDao.findById(Integer.parseInt(requestMap.get("id")));
                    if(!optionalItem.isEmpty()) {
                        Item item = getItemFromMap(requestMap, optionalItem.get());
                        if (requestMap.containsKey("status")) {
                            item.setStatus(requestMap.get("status"));
                        }
                        itemDao.save(item);
                        return RestaurantUtils.getResponseEntity("Item updated successfully", HttpStatus.OK);
                    }
                    else
                        return RestaurantUtils.getResponseEntity("Item id does not exist", HttpStatus.OK);
                }
                else
                    return RestaurantUtils.getResponseEntity(RestaurantConstants.INVALID_DATA, HttpStatus.BAD_REQUEST);
            }
            else
                return RestaurantUtils.getResponseEntity(RestaurantConstants.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
        } catch(Exception exception) {
            exception.printStackTrace();
        }
        return RestaurantUtils.getResponseEntity(RestaurantConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> deleteItem(Integer id) {
        try {
            if(jwtFilter.isAdmin()) {
                Optional<Item> optionalItem = itemDao.findById(id);
                if(!optionalItem.isEmpty()) {
                    itemDao.delete(optionalItem.get());
                    return RestaurantUtils.getResponseEntity("Item deleted successfully", HttpStatus.OK);
                }
                else
                    return RestaurantUtils.getResponseEntity("Item id does not exist", HttpStatus.OK);
            }
            else
                return RestaurantUtils.getResponseEntity(RestaurantConstants.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
        } catch(Exception exception) {
            exception.printStackTrace();
        }
        return RestaurantUtils.getResponseEntity(RestaurantConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<List<ItemDto>> getByCategory(Integer id) {
        try {
            return new ResponseEntity<>(itemDao.findByCategory(id), HttpStatus.OK);
        } catch(Exception exception) {
            exception.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<Map<Integer, List<ItemDto>>> getItemsGroupedByCategory(List<Integer> categoryIds) {
        try {
            Map<Integer, List<ItemDto>> groupedItems = new HashMap<>();
            /* For each category id, call itemDao.findByCategory(id) and put the result in the map */
            for(Integer id : categoryIds) {
                groupedItems.put(id, itemDao.findByCategory(id));
            }
            return new ResponseEntity<>(groupedItems, HttpStatus.OK);
        } catch (Exception exception) {
            exception.printStackTrace();
        }
        return new ResponseEntity<>(new HashMap<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<ItemDto> getItem(Integer id) {
        try {
            return new ResponseEntity<>(itemDao.findItemById(id), HttpStatus.OK);
        } catch(Exception exception) {
            exception.printStackTrace();
        }
        return new ResponseEntity<>(new ItemDto(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
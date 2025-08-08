package com.ay.restaurant.serviceImpl;

import com.ay.restaurant.constants.RestaurantConstants;
import com.ay.restaurant.dao.CategoryDao;
import com.ay.restaurant.jwt.JwtFilter;
import com.ay.restaurant.pojo.Category;
import com.ay.restaurant.pojo.Item;
import com.ay.restaurant.service.CategoryService;
import com.ay.restaurant.utils.RestaurantUtils;
import com.google.common.base.Strings;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryDao categoryDao;
    private final JwtFilter jwtFilter;

    @Override
    public ResponseEntity<String> addNewCategory(Map<String,String> requestMap) {
        try {
            if(jwtFilter.isAdmin()) {
                if(validateCategoryMap(requestMap, false)) {
                    categoryDao.save(getCategoryFromMap(requestMap));
                    return RestaurantUtils.getResponseEntity("Category added successfully", HttpStatus.OK);
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

    private boolean validateCategoryMap(Map<String,String> requestMap, boolean validateId) {
        if(requestMap.containsKey("name")) {
            if((requestMap.containsKey("id") && validateId) || !validateId)
                return true;
        }
        return false;
    }

    private Category getCategoryFromMap(Map<String,String> requestMap) {
        return new Category(requestMap.get("name"));
    }

    @Override
    public ResponseEntity<List<Category>> getAllCategories(String filterList) {
        try {
            if(!Strings.isNullOrEmpty(filterList) && filterList.equalsIgnoreCase("true"))
                return new ResponseEntity<>(categoryDao.findCategories(), HttpStatus.OK);
            return new ResponseEntity<>(categoryDao.findAll(), HttpStatus.OK);
        } catch(Exception exception) {
            exception.printStackTrace();
        }
        return new ResponseEntity<>(new ArrayList<>(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Override
    public ResponseEntity<String> updateCategory(Map<String,String> requestMap) {
        try {
            if(jwtFilter.isAdmin()) {
                if(validateCategoryMap(requestMap, true)) {
                    Optional<Category> optionalCategory = categoryDao.findById(Integer.parseInt(requestMap.get("id")));
                    if(!optionalCategory.isEmpty()) {
                        Category category = optionalCategory.get();
                        category.setName(requestMap.get("name"));
                        categoryDao.save(category);
                        return RestaurantUtils.getResponseEntity("Category updated successfully", HttpStatus.OK);
                    }
                    else
                        return RestaurantUtils.getResponseEntity("Category id does not exist", HttpStatus.OK);
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
    public ResponseEntity<String> deleteCategory(Integer id) {
        try {
            if(jwtFilter.isAdmin()) {
                Optional<Category> optionalCategory = categoryDao.findById(id);
                if(!optionalCategory.isEmpty()) {
                    categoryDao.delete(optionalCategory.get());
                    return RestaurantUtils.getResponseEntity("Category deleted successfully", HttpStatus.OK);
                }
                else
                    return RestaurantUtils.getResponseEntity("Category id does not exist", HttpStatus.OK);
            }
            else
                return RestaurantUtils.getResponseEntity(RestaurantConstants.UNAUTHORIZED_ACCESS, HttpStatus.UNAUTHORIZED);
        } catch(Exception exception) {
            exception.printStackTrace();
        }
        return RestaurantUtils.getResponseEntity(RestaurantConstants.SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
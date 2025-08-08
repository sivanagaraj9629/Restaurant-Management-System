package com.ay.restaurant.dao;

import com.ay.restaurant.pojo.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryDao extends JpaRepository<Category, Integer> {

    List<Category> findCategories();

}
package com.ay.restaurant.dao;

import com.ay.restaurant.dto.ItemDto;
import com.ay.restaurant.pojo.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ItemDao extends JpaRepository<Item, Integer> {

    List<ItemDto> findAllItems();
    List<ItemDto> findByCategory(@Param("id") Integer id);
    ItemDto findItemById(@Param("id") Integer id);

}

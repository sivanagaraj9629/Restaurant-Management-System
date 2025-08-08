package com.ay.restaurant.serviceImpl;

import com.ay.restaurant.dao.BillDao;
import com.ay.restaurant.dao.CategoryDao;
import com.ay.restaurant.dao.ItemDao;
import com.ay.restaurant.pojo.Bill;
import com.ay.restaurant.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final CategoryDao categoryDao;
    private final ItemDao itemDao;
    private final BillDao billDao;

    @Override
    public ResponseEntity<Map<String,Object>> getDetails() {
        Map<String,Object> map = new HashMap<>();
        try {
            map.put("categoryCount", categoryDao.count());
            map.put("itemCount", itemDao.count());
            map.put("billCount", billDao.count());
            return new ResponseEntity<>(map, HttpStatus.OK);
        } catch(Exception exception) {
            exception.printStackTrace();
        }
        return new ResponseEntity<>(map, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}

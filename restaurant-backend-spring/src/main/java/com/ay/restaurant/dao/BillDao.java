package com.ay.restaurant.dao;

import com.ay.restaurant.pojo.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BillDao extends JpaRepository<Bill, Integer> {

    List<Bill> findAllBills();

    List<Bill> findBillByUsername(@Param("username") String username);

    Bill findByUuid(String uuid);

}

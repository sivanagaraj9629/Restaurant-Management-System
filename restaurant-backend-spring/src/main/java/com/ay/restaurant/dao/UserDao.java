package com.ay.restaurant.dao;

import com.ay.restaurant.dto.UserDto;
import com.ay.restaurant.pojo.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserDao extends JpaRepository<User, Integer> {

    User findByEmail(@Param("email") String email);

    List<UserDto> findAllUsers();

    List<String> findAdminsEmail();

    /* Database operations typically require transactional support to ensure data consistency and integrity. Transactions guarantee
     * that a group of operations either all succeed or all fail together, ensuring atomicity (all or nothing)
     * Modifying queries include SQL statements that perform insert, update, delete, or DDL (Data Definition Language) operations */
    @Transactional
    @Modifying
    Integer updateStatus(@Param("status") String status, @Param("id") Integer id);

    @Transactional
    @Modifying
    Integer updatePassword(@Param("password") String password, @Param("id") Integer id);
    
}
package com.ay.restaurant.jwt;

import com.ay.restaurant.dao.UserDao;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserDao userDao;

    private com.ay.restaurant.pojo.User userDetail;

    /* The loadUserByUsername method is implemented to load user details based on the provided username from the UserDao by calling
    * findByEmail(email).
    * If a user with the given email is found, it constructs a UserDetails object which represents the authenticated user (containing
    * the username, password, and authorities) or it throws a UsernameNotFoundException */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        log.info("Inside loadUserByUsername {}");
        userDetail = userDao.findByEmail(email);
        if(!Objects.isNull(userDetail))
            return new User(userDetail.getEmail(), userDetail.getPassword(), new ArrayList<>());
        else
            throw new UsernameNotFoundException("User not found");

    }

    public com.ay.restaurant.pojo.User getUserDetail() {
        return userDetail;
    }

}

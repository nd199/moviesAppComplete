package com.naren.moviesapp.Service;

import com.naren.moviesapp.Dao.CustomerDao;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomerUserDetailsService implements UserDetailsService {
    private final CustomerDao customerDao;

    public CustomerUserDetailsService(CustomerDao customerDao) {
        this.customerDao = customerDao;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        return customerDao.getCustomerByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "Username %s not found".
                                        formatted(username)
                        ));
    }
}

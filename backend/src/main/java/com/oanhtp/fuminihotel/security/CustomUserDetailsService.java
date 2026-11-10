package com.oanhtp.fuminihotel.security;

import com.oanhtp.fuminihotel.entity.Customer;
import com.oanhtp.fuminihotel.repository.CustomerRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final CustomerRepository customerRepository;
    private final StaffProperties staffProperties;
    private final PasswordEncoder passwordEncoder;

    public CustomUserDetailsService(CustomerRepository customerRepository,
                                    StaffProperties staffProperties,
                                    @Lazy PasswordEncoder passwordEncoder) {
        this.customerRepository = customerRepository;
        this.staffProperties = staffProperties;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 1. Check if email matches configured Staff account
        if (staffProperties.getEmail() != null && staffProperties.getEmail().equalsIgnoreCase(username.trim())) {
            String encodedStaffPassword = passwordEncoder.encode(staffProperties.getPassword());
            return new UserPrincipal(
                    null,
                    staffProperties.getEmail(),
                    encodedStaffPassword,
                    staffProperties.getName(),
                    "STAFF",
                    true
            );
        }

        // 2. Check if email matches a registered Customer
        Customer customer = customerRepository.findByEmailAddress(username.trim())
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));

        boolean isActive = customer.getCustomerStatus() != null && customer.getCustomerStatus() == 1;

        return new UserPrincipal(
                customer.getCustomerID(),
                customer.getEmailAddress(),
                customer.getPassword(),
                customer.getCustomerFullName(),
                "CUSTOMER",
                isActive
        );
    }
}


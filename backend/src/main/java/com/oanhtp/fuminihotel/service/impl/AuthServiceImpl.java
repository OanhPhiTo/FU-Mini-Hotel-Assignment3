package com.oanhtp.fuminihotel.service.impl;

import com.oanhtp.fuminihotel.dto.request.LoginRequest;
import com.oanhtp.fuminihotel.dto.request.RegisterRequest;
import com.oanhtp.fuminihotel.dto.response.AuthResponse;
import com.oanhtp.fuminihotel.entity.Customer;
import com.oanhtp.fuminihotel.exception.BadRequestException;
import com.oanhtp.fuminihotel.exception.ConflictException;
import com.oanhtp.fuminihotel.exception.ForbiddenException;
import com.oanhtp.fuminihotel.exception.UnauthorizedException;
import com.oanhtp.fuminihotel.repository.CustomerRepository;
import com.oanhtp.fuminihotel.security.JwtService;
import com.oanhtp.fuminihotel.security.StaffProperties;
import com.oanhtp.fuminihotel.security.UserPrincipal;
import com.oanhtp.fuminihotel.service.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    private final CustomerRepository customerRepository;
    private final StaffProperties staffProperties;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthServiceImpl(CustomerRepository customerRepository,
                           StaffProperties staffProperties,
                           PasswordEncoder passwordEncoder,
                           JwtService jwtService) {
        this.customerRepository = customerRepository;
        this.staffProperties = staffProperties;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmailAddress().trim().toLowerCase();

        // Check if email conflicts with staff email
        if (staffProperties.getEmail() != null && staffProperties.getEmail().equalsIgnoreCase(email)) {
            throw new ConflictException("Email address is already reserved for administrative staff");
        }

        // Check if email already registered
        if (customerRepository.existsByEmailAddress(email)) {
            throw new ConflictException("Email address '" + email + "' is already registered");
        }

        Customer customer = new Customer();
        customer.setCustomerFullName(request.getCustomerFullName().trim());
        customer.setTelephone(request.getTelephone().trim());
        customer.setEmailAddress(email);
        customer.setCustomerBirthday(request.getCustomerBirthday());
        customer.setCustomerStatus(1); // Active by default
        customer.setPassword(passwordEncoder.encode(request.getPassword()));

        Customer savedCustomer = customerRepository.save(customer);

        UserPrincipal principal = new UserPrincipal(
                savedCustomer.getCustomerID(),
                savedCustomer.getEmailAddress(),
                savedCustomer.getPassword(),
                savedCustomer.getCustomerFullName(),
                "CUSTOMER",
                true
        );

        String token = jwtService.generateToken(principal);

        return new AuthResponse(
                token,
                savedCustomer.getEmailAddress(),
                savedCustomer.getCustomerFullName(),
                "CUSTOMER",
                savedCustomer.getCustomerID()
        );
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        String rawPassword = request.getPassword();

        // 1. Check if login credentials belong to Staff
        if (staffProperties.getEmail() != null && staffProperties.getEmail().equalsIgnoreCase(email)) {
            // Verify staff password
            if (!rawPassword.equals(staffProperties.getPassword())) {
                throw new UnauthorizedException("Invalid email or password");
            }

            UserPrincipal staffPrincipal = new UserPrincipal(
                    null,
                    staffProperties.getEmail(),
                    passwordEncoder.encode(staffProperties.getPassword()),
                    staffProperties.getName(),
                    "STAFF",
                    true
            );

            String token = jwtService.generateToken(staffPrincipal);

            return new AuthResponse(
                    token,
                    staffProperties.getEmail(),
                    staffProperties.getName(),
                    "STAFF",
                    null
            );
        }

        // 2. Otherwise verify against Customer repository
        Customer customer = customerRepository.findByEmailAddress(email)
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (!passwordEncoder.matches(rawPassword, customer.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        if (customer.getCustomerStatus() == null || customer.getCustomerStatus() != 1) {
            throw new ForbiddenException("Your account is currently disabled. Please contact hotel support.");
        }

        UserPrincipal customerPrincipal = new UserPrincipal(
                customer.getCustomerID(),
                customer.getEmailAddress(),
                customer.getPassword(),
                customer.getCustomerFullName(),
                "CUSTOMER",
                true
        );

        String token = jwtService.generateToken(customerPrincipal);

        return new AuthResponse(
                token,
                customer.getEmailAddress(),
                customer.getCustomerFullName(),
                "CUSTOMER",
                customer.getCustomerID()
        );
    }

    @Override
    public AuthResponse getCurrentUser(UserPrincipal principal) {
        if (principal == null) {
            throw new UnauthorizedException("User is not authenticated");
        }

        return new AuthResponse(
                null, // no need to re-issue token here
                principal.getUsername(),
                principal.getFullName(),
                principal.getRole(),
                principal.getId()
        );
    }
}


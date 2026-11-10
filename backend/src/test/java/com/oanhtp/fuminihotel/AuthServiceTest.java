package com.oanhtp.fuminihotel;

import com.oanhtp.fuminihotel.dto.request.LoginRequest;
import com.oanhtp.fuminihotel.dto.request.RegisterRequest;
import com.oanhtp.fuminihotel.dto.response.AuthResponse;
import com.oanhtp.fuminihotel.entity.Customer;
import com.oanhtp.fuminihotel.exception.ConflictException;
import com.oanhtp.fuminihotel.exception.UnauthorizedException;
import com.oanhtp.fuminihotel.repository.CustomerRepository;
import com.oanhtp.fuminihotel.security.JwtService;
import com.oanhtp.fuminihotel.security.StaffProperties;
import com.oanhtp.fuminihotel.security.UserPrincipal;
import com.oanhtp.fuminihotel.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private StaffProperties staffProperties;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthServiceImpl authService;

    private StaffProperties realStaff;

    @BeforeEach
    void setUp() {
        realStaff = new StaffProperties();
        realStaff.setEmail("staff@fuminihotel.com");
        realStaff.setPassword("Admin@123");
        realStaff.setName("Hotel Administrator");
    }

    @Test
    @DisplayName("Should successfully register a new customer")
    void testRegisterSuccess() {
        RegisterRequest request = new RegisterRequest(
                "Jane Doe",
                "0909888777",
                "jane@example.com",
                LocalDate.of(1996, 3, 14),
                "Password@123"
        );

        when(staffProperties.getEmail()).thenReturn(realStaff.getEmail());
        when(customerRepository.existsByEmailAddress("jane@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Password@123")).thenReturn("encodedPassword123");

        Customer savedCustomer = new Customer(
                10,
                "Jane Doe",
                "0909888777",
                "jane@example.com",
                LocalDate.of(1996, 3, 14),
                1,
                "encodedPassword123"
        );
        when(customerRepository.save(any(Customer.class))).thenReturn(savedCustomer);
        when(jwtService.generateToken(any(UserPrincipal.class))).thenReturn("mock-jwt-token");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("mock-jwt-token", response.getToken());
        assertEquals("CUSTOMER", response.getRole());
        assertEquals("jane@example.com", response.getEmail());
        assertEquals(10, response.getCustomerId());
        verify(customerRepository, times(1)).save(any(Customer.class));
    }

    @Test
    @DisplayName("Should reject registration if email is already taken")
    void testRegisterDuplicateEmail() {
        RegisterRequest request = new RegisterRequest(
                "Jane Doe",
                "0909888777",
                "duplicate@example.com",
                LocalDate.of(1996, 3, 14),
                "Password@123"
        );

        when(staffProperties.getEmail()).thenReturn(realStaff.getEmail());
        when(customerRepository.existsByEmailAddress("duplicate@example.com")).thenReturn(true);

        assertThrows(ConflictException.class, () -> authService.register(request));
        verify(customerRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should login staff using configured staff credentials")
    void testStaffLoginSuccess() {
        LoginRequest request = new LoginRequest("staff@fuminihotel.com", "Admin@123");

        when(staffProperties.getEmail()).thenReturn("staff@fuminihotel.com");
        when(staffProperties.getPassword()).thenReturn("Admin@123");
        when(staffProperties.getName()).thenReturn("Hotel Administrator");
        when(jwtService.generateToken(any(UserPrincipal.class))).thenReturn("staff-jwt-token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("staff-jwt-token", response.getToken());
        assertEquals("STAFF", response.getRole());
        assertEquals("staff@fuminihotel.com", response.getEmail());
        assertNull(response.getCustomerId());
    }

    @Test
    @DisplayName("Should login customer with valid email and password")
    void testCustomerLoginSuccess() {
        LoginRequest request = new LoginRequest("cust@fuminihotel.com", "Cust@123");

        when(staffProperties.getEmail()).thenReturn("staff@fuminihotel.com");

        Customer customer = new Customer(
                5,
                "Regular Cust",
                "0911222333",
                "cust@fuminihotel.com",
                LocalDate.of(1992, 1, 1),
                1,
                "hashedCustPass"
        );
        when(customerRepository.findByEmailAddress("cust@fuminihotel.com")).thenReturn(Optional.of(customer));
        when(passwordEncoder.matches("Cust@123", "hashedCustPass")).thenReturn(true);
        when(jwtService.generateToken(any(UserPrincipal.class))).thenReturn("customer-jwt-token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("customer-jwt-token", response.getToken());
        assertEquals("CUSTOMER", response.getRole());
        assertEquals(5, response.getCustomerId());
    }

    @Test
    @DisplayName("Should throw UnauthorizedException for bad password")
    void testCustomerLoginWrongPassword() {
        LoginRequest request = new LoginRequest("cust@fuminihotel.com", "WrongPass");

        when(staffProperties.getEmail()).thenReturn("staff@fuminihotel.com");

        Customer customer = new Customer(
                5,
                "Regular Cust",
                "0911222333",
                "cust@fuminihotel.com",
                LocalDate.of(1992, 1, 1),
                1,
                "hashedCustPass"
        );
        when(customerRepository.findByEmailAddress("cust@fuminihotel.com")).thenReturn(Optional.of(customer));
        when(passwordEncoder.matches("WrongPass", "hashedCustPass")).thenReturn(false);

        assertThrows(UnauthorizedException.class, () -> authService.login(request));
    }
}


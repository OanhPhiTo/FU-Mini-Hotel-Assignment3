package com.oanhtp.fuminihotel.service.impl;

import com.oanhtp.fuminihotel.dto.request.CustomerCreateRequest;
import com.oanhtp.fuminihotel.dto.request.CustomerProfileUpdateRequest;
import com.oanhtp.fuminihotel.dto.request.CustomerUpdateRequest;
import com.oanhtp.fuminihotel.dto.response.CustomerResponse;
import com.oanhtp.fuminihotel.dto.response.PageResponse;
import com.oanhtp.fuminihotel.entity.Customer;
import com.oanhtp.fuminihotel.exception.BadRequestException;
import com.oanhtp.fuminihotel.exception.ConflictException;
import com.oanhtp.fuminihotel.exception.ResourceNotFoundException;
import com.oanhtp.fuminihotel.repository.BookingReservationRepository;
import com.oanhtp.fuminihotel.repository.CustomerRepository;
import com.oanhtp.fuminihotel.security.StaffProperties;
import com.oanhtp.fuminihotel.service.CustomerService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final BookingReservationRepository bookingReservationRepository;
    private final PasswordEncoder passwordEncoder;
    private final StaffProperties staffProperties;

    public CustomerServiceImpl(CustomerRepository customerRepository,
                               BookingReservationRepository bookingReservationRepository,
                               PasswordEncoder passwordEncoder,
                               StaffProperties staffProperties) {
        this.customerRepository = customerRepository;
        this.bookingReservationRepository = bookingReservationRepository;
        this.passwordEncoder = passwordEncoder;
        this.staffProperties = staffProperties;
    }

    private CustomerResponse mapToResponse(Customer customer) {
        if (customer == null) return null;
        return new CustomerResponse(
                customer.getCustomerID(),
                customer.getCustomerFullName(),
                customer.getTelephone(),
                customer.getEmailAddress(),
                customer.getCustomerBirthday(),
                customer.getCustomerStatus()
        );
    }

    @Override
    public PageResponse<CustomerResponse> getAllCustomers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("customerID").descending());
        Page<Customer> customerPage = customerRepository.findAll(pageable);
        return PageResponse.from(customerPage, this::mapToResponse);
    }

    @Override
    public PageResponse<CustomerResponse> searchCustomers(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("customerID").descending());
        Page<Customer> customerPage;
        if (keyword == null || keyword.trim().isEmpty()) {
            customerPage = customerRepository.findAll(pageable);
        } else {
            customerPage = customerRepository.searchCustomers(keyword.trim(), pageable);
        }
        return PageResponse.from(customerPage, this::mapToResponse);
    }

    @Override
    public CustomerResponse getCustomerById(Integer id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + id));
        return mapToResponse(customer);
    }

    @Override
    @Transactional
    public CustomerResponse createCustomer(CustomerCreateRequest request) {
        String email = request.getEmailAddress().trim().toLowerCase();

        if (staffProperties.getEmail() != null && staffProperties.getEmail().equalsIgnoreCase(email)) {
            throw new ConflictException("Email address is reserved for administrative staff");
        }

        if (customerRepository.existsByEmailAddress(email)) {
            throw new ConflictException("Email address '" + email + "' is already in use");
        }

        Customer customer = new Customer();
        customer.setCustomerFullName(request.getCustomerFullName().trim());
        customer.setTelephone(request.getTelephone().trim());
        customer.setEmailAddress(email);
        customer.setCustomerBirthday(request.getCustomerBirthday());
        customer.setCustomerStatus(request.getCustomerStatus() != null ? request.getCustomerStatus() : 1);
        customer.setPassword(passwordEncoder.encode(request.getPassword()));

        Customer saved = customerRepository.save(customer);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public CustomerResponse updateCustomer(Integer id, CustomerUpdateRequest request) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + id));

        customer.setCustomerFullName(request.getCustomerFullName().trim());
        customer.setTelephone(request.getTelephone().trim());
        customer.setCustomerBirthday(request.getCustomerBirthday());
        if (request.getCustomerStatus() != null) {
            customer.setCustomerStatus(request.getCustomerStatus());
        }

        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            customer.setPassword(passwordEncoder.encode(request.getPassword().trim()));
        }

        Customer updated = customerRepository.save(customer);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteCustomer(Integer id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + id));

        // Business rule: Check if customer has booking history
        boolean hasBookings = bookingReservationRepository.existsByCustomerCustomerID(id);
        if (hasBookings) {
            throw new BadRequestException("Cannot delete customer (ID: " + id + ") because they have existing booking history. Please set status to Inactive instead.");
        }

        customerRepository.delete(customer);
    }

    @Override
    public CustomerResponse getMyProfile(Integer customerId) {
        return getCustomerById(customerId);
    }

    @Override
    @Transactional
    public CustomerResponse updateMyProfile(Integer customerId, CustomerProfileUpdateRequest request) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer profile not found"));

        customer.setCustomerFullName(request.getCustomerFullName().trim());
        customer.setTelephone(request.getTelephone().trim());
        customer.setCustomerBirthday(request.getCustomerBirthday());

        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            customer.setPassword(passwordEncoder.encode(request.getPassword().trim()));
        }

        Customer updated = customerRepository.save(customer);
        return mapToResponse(updated);
    }
}


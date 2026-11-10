package com.oanhtp.fuminihotel.controller;

import com.oanhtp.fuminihotel.dto.request.CustomerCreateRequest;
import com.oanhtp.fuminihotel.dto.request.CustomerProfileUpdateRequest;
import com.oanhtp.fuminihotel.dto.request.CustomerUpdateRequest;
import com.oanhtp.fuminihotel.dto.response.ApiResponse;
import com.oanhtp.fuminihotel.dto.response.CustomerResponse;
import com.oanhtp.fuminihotel.dto.response.PageResponse;
import com.oanhtp.fuminihotel.security.UserPrincipal;
import com.oanhtp.fuminihotel.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<ApiResponse<PageResponse<CustomerResponse>>> getAllCustomers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageResponse<CustomerResponse> customers = customerService.getAllCustomers(page, size);
        return ResponseEntity.ok(ApiResponse.ok(customers));
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<ApiResponse<PageResponse<CustomerResponse>>> searchCustomers(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageResponse<CustomerResponse> customers = customerService.searchCustomers(keyword, page, size);
        return ResponseEntity.ok(ApiResponse.ok(customers));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<ApiResponse<CustomerResponse>> getCustomerById(@PathVariable Integer id) {
        CustomerResponse customer = customerService.getCustomerById(id);
        return ResponseEntity.ok(ApiResponse.ok(customer));
    }

    @PostMapping
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<ApiResponse<CustomerResponse>> createCustomer(@Valid @RequestBody CustomerCreateRequest request) {
        CustomerResponse response = customerService.createCustomer(request);
        return new ResponseEntity<>(ApiResponse.ok("Customer created successfully", response), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<ApiResponse<CustomerResponse>> updateCustomer(@PathVariable Integer id,
                                                                        @Valid @RequestBody CustomerUpdateRequest request) {
        CustomerResponse response = customerService.updateCustomer(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Customer updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('STAFF')")
    public ResponseEntity<ApiResponse<Void>> deleteCustomer(@PathVariable Integer id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok(ApiResponse.ok("Customer deleted successfully", null));
    }

    @GetMapping("/profile/me")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<CustomerResponse>> getMyProfile(@AuthenticationPrincipal UserPrincipal principal) {
        CustomerResponse response = customerService.getMyProfile(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PutMapping("/profile/me")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<CustomerResponse>> updateMyProfile(@AuthenticationPrincipal UserPrincipal principal,
                                                                         @Valid @RequestBody CustomerProfileUpdateRequest request) {
        CustomerResponse response = customerService.updateMyProfile(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", response));
    }
}


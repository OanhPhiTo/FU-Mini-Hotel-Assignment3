package com.oanhtp.fuminihotel.service;

import com.oanhtp.fuminihotel.dto.request.CustomerCreateRequest;
import com.oanhtp.fuminihotel.dto.request.CustomerProfileUpdateRequest;
import com.oanhtp.fuminihotel.dto.request.CustomerUpdateRequest;
import com.oanhtp.fuminihotel.dto.response.CustomerResponse;
import com.oanhtp.fuminihotel.dto.response.PageResponse;

public interface CustomerService {

    PageResponse<CustomerResponse> getAllCustomers(int page, int size);

    PageResponse<CustomerResponse> searchCustomers(String keyword, int page, int size);

    CustomerResponse getCustomerById(Integer id);

    CustomerResponse createCustomer(CustomerCreateRequest request);

    CustomerResponse updateCustomer(Integer id, CustomerUpdateRequest request);

    void deleteCustomer(Integer id);

    CustomerResponse getMyProfile(Integer customerId);

    CustomerResponse updateMyProfile(Integer customerId, CustomerProfileUpdateRequest request);
}


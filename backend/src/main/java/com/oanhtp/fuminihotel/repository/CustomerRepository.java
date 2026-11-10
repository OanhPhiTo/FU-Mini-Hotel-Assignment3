package com.oanhtp.fuminihotel.repository;

import com.oanhtp.fuminihotel.entity.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {

    Optional<Customer> findByEmailAddress(String emailAddress);

    boolean existsByEmailAddress(String emailAddress);

    boolean existsByEmailAddressAndCustomerIDNot(String emailAddress, Integer customerID);

    @Query("SELECT c FROM Customer c WHERE " +
           "LOWER(c.customerFullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.emailAddress) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "c.telephone LIKE CONCAT('%', :keyword, '%')")
    Page<Customer> searchCustomers(@Param("keyword") String keyword, Pageable pageable);
}

